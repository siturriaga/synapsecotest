#!/usr/bin/env node

const assert = require('node:assert/strict')
const { loadTsModule } = require('./lib/load-ts-module.cjs')

async function runAuthRefreshScenario() {
  const tokenCalls = []
  let fetchCallCount = 0

  global.fetch = async (url, options = {}) => {
    fetchCallCount += 1
    if (fetchCallCount === 1) {
      return new Response(JSON.stringify({ error: 'expired' }), {
        status: 440,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    const headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    assert.equal(headers.get('Authorization'), 'Bearer token-refresh', 'should retry with refreshed token')
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const mockAuth = {
    get currentUser() {
      return {
        async getIdToken(forceRefresh) {
          tokenCalls.push(Boolean(forceRefresh))
          return forceRefresh ? 'token-refresh' : 'token-initial'
        }
      }
    }
  }

  const { safeFetch } = loadTsModule('src/utils/safeFetch.ts', {
    mocks: {
      '../firebase': { auth: mockAuth }
    }
  })

  const result = await safeFetch('/.netlify/functions/demo', { method: 'POST', body: JSON.stringify({}) })
  assert.deepEqual(result, { ok: true })
  assert.deepEqual(tokenCalls, [false, true], 'should refresh token after 440 response')
  assert.equal(fetchCallCount, 2, 'should only retry original target after refreshing token')
}

async function runFallbackScenario() {
  const callOrder = []

  global.fetch = async (url) => {
    callOrder.push(url)
    if (url === '/.netlify/functions/status') {
      return new Response('missing', { status: 404 })
    }
    if (url === '/api/status') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    throw new Error(`Unexpected target ${url}`)
  }

  const mockAuth = { currentUser: null }

  const { safeFetch } = loadTsModule('src/utils/safeFetch.ts', {
    mocks: {
      '../firebase': { auth: mockAuth }
    }
  })

  const result = await safeFetch('/.netlify/functions/status')
  assert.deepEqual(result, { status: 'ok' })
  assert.deepEqual(callOrder.slice(0, 2), ['/.netlify/functions/status', '/api/status'])
}

async function runRemoteBaseScenario() {
  const callOrder = []
  const responses = {
    '/.netlify/functions/demo': new Response('missing', { status: 404 }),
    '/api/demo': new Response('missing', { status: 404 }),
    'https://remote.example/.netlify/functions/demo': new Response('missing', { status: 404 }),
    'https://remote.example/api/demo': new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  global.fetch = async (url) => {
    callOrder.push(url)
    if (url === 'http://localhost:8888/.netlify/functions/demo') {
      throw new TypeError('connect ECONNREFUSED 127.0.0.1:8888')
    }
    if (Object.prototype.hasOwnProperty.call(responses, url)) {
      return responses[url]
    }
    throw new Error(`Unexpected target ${url}`)
  }

  const mockAuth = { currentUser: null }
  const previousEnv = process.env.VITE_FUNCTION_BASE_URL
  process.env.VITE_FUNCTION_BASE_URL = 'https://remote.example/api'

  try {
    const { safeFetch } = loadTsModule('src/utils/safeFetch.ts', {
      mocks: {
        '../firebase': { auth: mockAuth }
      }
    })

    const result = await safeFetch('/.netlify/functions/demo')
    assert.deepEqual(result, { ok: true })
    const expectedOrder = [
      '/.netlify/functions/demo',
      '/api/demo',
      'https://remote.example/.netlify/functions/demo',
      'https://remote.example/api/demo'
    ]

    const withoutLocalProxy = callOrder.filter((entry) => entry !== 'http://localhost:8888/.netlify/functions/demo')
    assert.deepEqual(
      withoutLocalProxy,
      expectedOrder,
      'should exhaust local fallbacks before hitting remote function and api bases'
    )

    const localProxyIndex = callOrder.indexOf('http://localhost:8888/.netlify/functions/demo')
    if (localProxyIndex !== -1) {
      assert(
        localProxyIndex < callOrder.indexOf('https://remote.example/.netlify/functions/demo'),
        'local Netlify proxy should be attempted before remote targets'
      )
    }
  } finally {
    if (previousEnv === undefined) {
      delete process.env.VITE_FUNCTION_BASE_URL
    } else {
      process.env.VITE_FUNCTION_BASE_URL = previousEnv
    }
  }
}

async function main() {
  try {
    await runAuthRefreshScenario()
    await runFallbackScenario()
    await runRemoteBaseScenario()
    console.log('API canary passed')
  } catch (error) {
    console.error('API canary failed')
    console.error(error)
    process.exitCode = 1
  }
}

main()
