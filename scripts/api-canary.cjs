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

async function main() {
  try {
    await runAuthRefreshScenario()
    await runFallbackScenario()
    console.log('API canary passed')
  } catch (error) {
    console.error('API canary failed')
    console.error(error)
    process.exitCode = 1
  }
}

main()
