#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')
const ignoreDirs = new Set([
  'node_modules',
  '.git',
  'dist',
  'build-tests',
  '.idea',
  '.vscode'
])

const patterns = [
  { name: 'Google API key', regex: /AIza[0-9A-Za-z\-_]{35}/g },
  { name: 'OpenAI key', regex: /sk-[A-Za-z0-9]{20,}/g },
  { name: 'Private key header', regex: /-----BEGIN [A-Z ]+PRIVATE KEY-----/g },
  { name: 'JWT secret', regex: /"?secret"?\s*[:=]\s*["'][A-Za-z0-9+/]{24,}[=]{0,2}["']/gi }
]

const findings = []

/**
 * @param {string} dir
 */
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.npm')) continue
    if (ignoreDirs.has(entry.name)) continue
    const resolved = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(resolved)
      continue
    }
    const size = fs.statSync(resolved).size
    if (size === 0 || size > 512 * 1024) {
      continue
    }
    const buffer = fs.readFileSync(resolved)
    const text = buffer.toString('utf8')
    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0
      const matches = text.match(pattern.regex)
      if (matches && matches.length) {
        findings.push({ file: path.relative(projectRoot, resolved), pattern: pattern.name, samples: matches.slice(0, 3) })
      }
    }
  }
}

walk(projectRoot)

if (findings.length) {
  console.error('Potential secrets detected:')
  for (const finding of findings) {
    console.error(`- ${finding.pattern} in ${finding.file}`)
    finding.samples.forEach((sample) => console.error(`    sample: ${sample.substring(0, 60)}${sample.length > 60 ? '…' : ''}`))
  }
  process.exitCode = 1
} else {
  console.log('Secrets scan completed with no findings.')
}
