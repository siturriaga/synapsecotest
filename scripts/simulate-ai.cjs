#!/usr/bin/env node

const assert = require('node:assert/strict')
const { loadTsModule } = require('./lib/load-ts-module.cjs')

async function main() {
  const payload = { prompt: 'ping' }
  const calls = []

  global.fetch = async (url, options = {}) => {
    calls.push({ url, options })
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

  await safeFetch('/generateAssignment', { method: 'POST', body: JSON.stringify(payload) })
  assert.equal(calls.length, 1, 'should make one request for successful call')
  const [{ url, options }] = calls
  assert.equal(url, '/api/generateAssignment', 'request must target /api/generateAssignment')
  const headers = new Headers(options.headers)
  assert.equal(headers.get('Content-Type'), 'application/json', 'Content-Type header should be JSON')
  assert.equal(headers.get('Accept'), 'application/json', 'Accept header should be JSON')

  global.fetch = async () =>
    new Response(JSON.stringify({ error: 'upstream failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    })

  try {
    await safeFetch('/generateAssignment', { method: 'POST', body: JSON.stringify(payload) })
    console.error('FAIL expected error from 502 response')
    process.exitCode = 1
    return
  } catch (error) {
    assert.equal(error.status, 502, 'SafeFetchError should expose status code')
    assert(/502/.test(String(error.message)), 'error message should include status code')
    assert(/upstream failed/.test(String(error.message)), 'error message should include body excerpt')
  }

  console.log('simulate:ai ok')
}

main().catch((error) => {
  console.error('simulate:ai failed')
  console.error(error)
  process.exitCode = 1
})
