#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const requiredFiles = [
  'netlify/functions/generateAssignment.ts',
  'src/utils/netlifyTargets.ts',
  'src/utils/safeFetch.ts',
  'src/main.tsx',
  'index.html'
]

let hasError = false

for (const relative of requiredFiles) {
  const absolute = path.resolve(process.cwd(), relative)
  if (!fs.existsSync(absolute)) {
    console.error(`FAIL missing required file: ${relative}`)
    hasError = true
  }
}

if (hasError) {
  process.exitCode = 1
} else {
  console.log('check:paths ok')
}
