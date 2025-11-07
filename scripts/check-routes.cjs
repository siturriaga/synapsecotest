#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const expectedToml = `[build]
command = "npm run build"
publish = "dist"
functions = "netlify/functions"

[functions]
directory = "netlify/functions"
external_node_modules = ["firebase-admin","xlsx","mammoth","pdf-parse","busboy"]
node_bundler = "esbuild"

[[headers]]
for = "/*"
  [headers.values]
  Content-Security-Policy = """
    default-src 'self';
    script-src 'self' https://www.gstatic.com https://www.googleapis.com https://apis.google.com https://accounts.google.com;
    script-src-elem 'self' https://www.gstatic.com https://www.googleapis.com https://apis.google.com https://accounts.google.com;
    connect-src 'self'
      https://firestore.googleapis.com
      https://identitytoolkit.googleapis.com
      https://securetoken.googleapis.com
      https://www.googleapis.com
      https://www.googleapis.com/oauth2/v3/token
      https://oauth2.googleapis.com
      https://apis.google.com
      https://accounts.google.com
      https://generativelanguage.googleapis.com
      https://firebasestorage.googleapis.com;
    img-src 'self' data: https:;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    frame-src 'self' https://*.google.com https://*.firebaseapp.com;
    frame-ancestors 'none';
    base-uri 'self';
    object-src 'none';
  """
  Cross-Origin-Opener-Policy = "same-origin-allow-popups"

[[redirects]]
from = "/api/*"
to = "/.netlify/functions/:splat"
status = 200

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
`

let hasError = false

const tomlPath = path.resolve(process.cwd(), 'netlify.toml')
const currentToml = fs.readFileSync(tomlPath, 'utf8')
if (currentToml !== expectedToml) {
  console.error('FAIL netlify.toml does not match required block')
  hasError = true
}

const targetsPath = path.resolve(process.cwd(), 'src/utils/netlifyTargets.ts')
const targetsSource = fs.readFileSync(targetsPath, 'utf8')

if (!/\/api\//.test(targetsSource)) {
  console.error('FAIL netlifyTargets does not build /api/ URLs')
  hasError = true
}

if (/VITE_FUNCTION_BASE_URL/.test(targetsSource)) {
  console.error('FAIL netlifyTargets still references VITE_FUNCTION_BASE_URL')
  hasError = true
}

if (hasError) {
  process.exitCode = 1
} else {
  console.log('check:routes ok')
}
