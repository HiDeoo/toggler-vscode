export function runTests(mocha: Mocha | BrowserMocha, resolve: () => void, reject: (error: unknown) => void) {
  try {
    mocha.run((failures) => {
      if (failures > 0) {
        reject(new Error(`${failures} tests failed.`))
      } else {
        resolve()
      }
    })
  } catch (error) {
    console.error(error)
    reject(error)
  }
}

export function getMochaOptions(): Mocha.MochaOptions {
  return {
    color: true,
    reporter: undefined,
    ui: 'tdd',
  }
}
