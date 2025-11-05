#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')
const netlifyToml = path.join(projectRoot, 'netlify.toml')
const redirectsFile = path.join(projectRoot, 'public', '_redirects')

function ensureFileContains(filePath, checks) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required routing file missing: ${path.relative(projectRoot, filePath)}`)
  }
  const content = fs.readFileSync(filePath, 'utf8')
  for (const check of checks) {
    if (!check.regex.test(content)) {
      throw new Error(`${check.message} (${path.relative(projectRoot, filePath)})`)
    }
  }
}

const netlifyChecks = [
  { regex: /\[\[redirects\]\]\s*\nfrom\s*=\s*"\/\*"[\s\S]*?to\s*=\s*"\/index.html"/m, message: 'Missing SPA fallback redirect' },
  {
    regex: /\[\[redirects\]\]\s*\nfrom\s*=\s*"\/api\/\*"[\s\S]*?to\s*=\s*"\/\.netlify\/functions\/:splat"/m,
    message: 'Missing API proxy redirect'
  }
]

const redirectsChecks = [
  { regex: /^\/api\/\*\s+\/\.netlify\/functions\/:splat\s+200$/m, message: 'Redirects file missing API proxy rule' },
  { regex: /^\/\*\s+\/index.html\s+200$/m, message: 'Redirects file missing SPA fallback rule' }
]

try {
  ensureFileContains(netlifyToml, netlifyChecks)
  ensureFileContains(redirectsFile, redirectsChecks)
  console.log('Routing verification passed: SPA fallback and API proxy rules are in place.')
} catch (error) {
  console.error('Routing verification failed:')
  console.error(error.message)
  process.exitCode = 1
}
