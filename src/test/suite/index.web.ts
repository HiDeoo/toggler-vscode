require('mocha/mocha')

import { getMochaOptions, runTests } from '../mocha'

export function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    mocha.setup(getMochaOptions())

    const importAll = (requireContext: __WebpackModuleApi.RequireContext) =>
      requireContext.keys().forEach(requireContext)
    importAll(require.context('.', true, /\.test$/))

    runTests(mocha, resolve, reject)
  })
}
