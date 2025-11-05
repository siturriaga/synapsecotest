const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

const defaultCompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS,
  esModuleInterop: true,
  skipLibCheck: true
}

function resolveTsPath(fromFile, specifier) {
  if (!specifier.startsWith('.')) {
    return null
  }
  const baseDir = path.dirname(fromFile)
  const candidates = []
  const directPath = path.resolve(baseDir, specifier)
  candidates.push(directPath)
  const extensions = ['.ts', '.tsx', '.js', '.jsx']
  for (const ext of extensions) {
    candidates.push(`${directPath}${ext}`)
  }
  const indexExtensions = extensions.map((ext) => path.join(directPath, `index${ext}`))
  candidates.push(...indexExtensions)
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate
    }
  }
  return null
}

function loadTsModule(modulePath, { mocks = {} } = {}) {
  const absolutePath = path.resolve(process.cwd(), modulePath)
  const source = fs.readFileSync(absolutePath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: defaultCompilerOptions,
    fileName: absolutePath
  })

  const sanitizedOutput = transpiled.outputText.replace(/import\.meta/g, 'globalThis.__import_meta__')
  const module = { exports: {} }
  const localMocks = mocks

  function localRequire(specifier) {
    if (process.env.DEBUG_LOAD_TS === '1') {
      console.log(`load-ts-module: require ${specifier} from ${absolutePath}`)
    }
    if (Object.prototype.hasOwnProperty.call(localMocks, specifier)) {
      return localMocks[specifier]
    }
    if (specifier.startsWith('.')) {
      const resolved = resolveTsPath(absolutePath, specifier)
      if (!resolved) {
        throw new Error(`Unable to resolve module "${specifier}" from ${absolutePath}`)
      }
      return loadTsModule(resolved, { mocks: localMocks })
    }
    return require(specifier)
  }

  const wrapper = new Function('require', 'module', 'exports', '__filename', '__dirname', sanitizedOutput)
  const previousImportMeta = globalThis.__import_meta__
  if (!globalThis.__import_meta__) {
    globalThis.__import_meta__ = { env: { ...process.env } }
  }
  try {
    wrapper(localRequire, module, module.exports, absolutePath, path.dirname(absolutePath))
  } finally {
    globalThis.__import_meta__ = previousImportMeta
  }
  return module.exports
}

module.exports = { loadTsModule }
