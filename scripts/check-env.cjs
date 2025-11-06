#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const targetPattern = /VITE_FUNCTION_BASE_URL/i
const roots = ['src', 'scripts', 'docs', 'README.md', 'netlify']
let hasError = false

function scanFile(filePath) {
  if (!fs.statSync(filePath).isFile()) {
    return
  }
  const ext = path.extname(filePath)
  const allowed = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.md', '.toml', '.json'])
  if (!allowed.has(ext) && ext !== '') {
    return
  }
  const content = fs.readFileSync(filePath, 'utf8')
  if (targetPattern.test(content)) {
    const relative = path.relative(process.cwd(), filePath)
    if (relative === 'scripts/check-env.cjs' || relative === 'scripts/check-routes.cjs') {
      return
    }
    console.error(`FAIL unexpected reference in ${relative}`)
    hasError = true
  }
}

function walk(entry) {
  const absolute = path.resolve(process.cwd(), entry)
  if (!fs.existsSync(absolute)) {
    return
  }
  const stats = fs.statSync(absolute)
  if (stats.isDirectory()) {
    for (const child of fs.readdirSync(absolute)) {
      if (['.git', 'node_modules', 'dist', 'build-tests'].includes(child)) {
        continue
      }
      walk(path.join(entry, child))
    }
  } else {
    scanFile(absolute)
  }
}

for (const entry of roots) {
  walk(entry)
}

if (hasError) {
  process.exitCode = 1
} else {
    console.log('check:env ok (no VITE_FUNCTION_BASE_URL references)')
}
