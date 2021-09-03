import * as path from 'path'
import * as Mocha from 'mocha'
import * as glob from 'glob'

import { getMochaOptions, runTests } from '../mocha'

export function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    const mocha = new Mocha(getMochaOptions())

    const testsRoot = path.resolve(__dirname, '..')

    glob('**/**.test.js', { cwd: testsRoot }, (error, files) => {
      if (error) {
        return reject(error)
      }

      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)))

      runTests(mocha, resolve, reject)
    })
  })
}
