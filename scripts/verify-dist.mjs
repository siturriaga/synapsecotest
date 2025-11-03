import { readdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'

async function hasFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries.some((entry) => entry.isFile())
}

async function main() {
  const distDir = resolve('dist')

  try {
    const stats = await stat(distDir)
    if (!stats.isDirectory()) {
      console.error(`Expected \'${distDir}\' to be a directory.`)
      exit(1)
    }
  } catch (error) {
    console.error('Build output directory "dist" was not created.')
    console.error(error instanceof Error ? error.message : error)
    exit(1)
  }

  const distFiles = await readdir(distDir)
  if (!distFiles.includes('index.html')) {
    console.error('Missing index.html in the dist directory. Vite build did not complete correctly.')
    exit(1)
  }

  const assetsDir = resolve(distDir, 'assets')
  try {
    const stats = await stat(assetsDir)
    if (!stats.isDirectory()) {
      console.error('dist/assets exists but is not a directory.')
      exit(1)
    }
  } catch (error) {
    console.error('Build output is missing the assets directory.')
    console.error(error instanceof Error ? error.message : error)
    exit(1)
  }

  if (!(await hasFiles(assetsDir))) {
    console.error('dist/assets is empty. The build did not emit any bundled assets.')
    exit(1)
  }
}

main().catch((error) => {
  console.error('Unexpected error while verifying the production build output:')
  console.error(error)
  exit(1)
})
