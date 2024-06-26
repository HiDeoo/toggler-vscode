import path from 'node:path'

import { runTests } from '@vscode/test-electron'

async function main() {
  // The folder containing the Extension Manifest package.json
  // Passed to `--extensionDevelopmentPath`
  const extensionDevelopmentPath = path.resolve(__dirname, '../../')

  // The path to test runner
  // Passed to --extensionTestsPath
  const extensionTestsPath = path.resolve(__dirname, './suite/index')

  const testWorkspace = path.resolve(__dirname, '../../src/test/fixtures/')

  // Download VS Code, unzip it and run the integration test
  await runTests({ extensionDevelopmentPath, extensionTestsPath, launchArgs: ['--disable-extensions', testWorkspace] })
}

main().catch(() => {
  console.error('Failed to run tests')
  process.exit(1)
})
