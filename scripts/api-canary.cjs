#!/usr/bin/env node

const assert = require('node:assert/strict')
const { loadTsModule } = require('./lib/load-ts-module.cjs')

async function runAuthRefreshScenario() {
  const tokenCalls = []
  let fetchCount = 0

  global.fetch = async (url, options = {}) => {
    fetchCount += 1
    if (fetchCount === 1) {
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
  assert.equal(fetchCount, 2, 'should only retry once after refreshing token')
}

async function runPathNormalizationScenario() {
  const calls = []
  global.fetch = async (url) => {
    calls.push(url)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const mockAuth = { currentUser: null }
  const { safeFetch } = loadTsModule('src/utils/safeFetch.ts', {
    mocks: {
      '../firebase': { auth: mockAuth }
    }
  })

  await safeFetch('/.netlify/functions/status')
  assert.equal(calls.length, 1, 'should make a single request')
  assert.equal(calls[0], '/api/status', 'should map Netlify path to /api/ prefix')
}

async function main() {
  try {
    await runAuthRefreshScenario()
    await runPathNormalizationScenario()
    console.log('API canary passed')
  } catch (error) {
    console.error('API canary failed')
    console.error(error)
    process.exitCode = 1
  }
}

main()
