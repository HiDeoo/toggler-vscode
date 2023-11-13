import path from 'node:path'

import { globSync } from 'glob'
import Mocha from 'mocha'

import { getMochaOptions, runTests } from '../mocha'

export function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    const mocha = new Mocha(getMochaOptions())

    const testsRoot = path.resolve(__dirname, '..')

    const files = globSync('**/**.test.js', { cwd: testsRoot })

    for (const file of files) {
      mocha.addFile(path.resolve(testsRoot, file))
    }

    runTests(mocha, resolve, reject)
  })
}
