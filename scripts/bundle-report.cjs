#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')
const assetsDir = path.join(projectRoot, 'dist', 'assets')

if (!fs.existsSync(assetsDir)) {
  console.log('Bundle report skipped: dist/assets not found. Run `npm run build` first.')
  process.exit(0)
}

const LIMITS = {
  js: 256 * 1024,
  css: 128 * 1024
}

const rows = []

for (const entry of fs.readdirSync(assetsDir)) {
  if (entry.endsWith('.map')) continue
  const filePath = path.join(assetsDir, entry)
  const stat = fs.statSync(filePath)
  if (!stat.isFile()) continue
  const ext = path.extname(entry).slice(1)
  rows.push({ file: entry, size: stat.size, type: ext })
}

rows.sort((a, b) => b.size - a.size)

const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

let warnings = 0
console.log('Bundle size report:')
rows.forEach((row) => {
  const sizeKb = row.size / 1024
  const limit = LIMITS[row.type] ?? null
  const isOver = limit !== null && row.size > limit
  if (isOver) warnings += 1
  const label = `${row.file.padEnd(36)} ${formatter.format(sizeKb).padStart(8)} kB${isOver ? '  ⚠️  exceeds recommended cap' : ''}`
  console.log(label)
})

if (warnings) {
  console.warn(`${warnings} bundle(s) exceed the recommended caps. Consider code splitting or trimming dependencies.`)
}
