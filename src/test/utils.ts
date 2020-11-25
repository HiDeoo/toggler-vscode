import * as assert from 'assert'
import { commands, Position, TextDocument, TextEditor, Uri, window, workspace, WorkspaceConfiguration } from 'vscode'

/**
 * Runs code in an untitled file editor.
 * @param content - The editor initial content.
 * @param run - The code to run in the editor.
 * @param settings - The settings to use when running the code.
 */
export async function withEditor(
  content: string,
  run: (doc: TextDocument, editor: TextEditor) => void,
  settings?: TestSettings
) {
  const document = await workspace.openTextDocument(Uri.parse('untitled:Toggler'))
  const editor = await window.showTextDocument(document)

  let currentSettings: TestSettings | undefined

  if (settings) {
    currentSettings = await setTestSettings(settings)
  }

  await editor.edit((editBuilder) => {
    editBuilder.insert(new Position(0, 0), content)
  })

  await run(document, editor)

  if (settings && currentSettings) {
    await setTestSettings(currentSettings)
  }

  return commands.executeCommand('workbench.action.closeAllEditors')
}

/**
 * Asserts that the text of a document matches a specific string.
 * @param document - The document.
 * @param expected - The expected content.
 */
export function assertDocumentTextEqual(document: TextDocument, expected: string) {
  assert.strictEqual(document.getText(), expected)
}

/**
 * Updates settings for a specific test and returns the previous ones before the update.
 * @param settings - The new settings.
 */
async function setTestSettings(settings: TestSettings): Promise<TestSettings> {
  const currentTestSettings: TestSettings = {}

  if (settings.global) {
    currentTestSettings.global = await setConfigurationSettings(settings.global, workspace.getConfiguration('toggler'))
  }

  if (settings.language) {
    currentTestSettings.language = await Promise.all(
      settings.language.map(async ([languageId, settings]) => {
        const currentLanguageSettings = await setConfigurationSettings(
          settings,
          workspace.getConfiguration('toggler', { languageId }),
          languageId
        )

        return [languageId, currentLanguageSettings] as [string, ExtensionSettings]
      })
    )
  }

  return currentTestSettings
}

/**
 * Sets settings on a specific workspace configuration.
 * @param settings - The new settings.
 * @param configuration - The configuration (scoped or not) containing the settings to update.
 * @param languageId - The language ID if any.
 */
async function setConfigurationSettings(
  settings: ExtensionSettings,
  configuration: WorkspaceConfiguration,
  languageId?: string
): Promise<ExtensionSettings> {
  const currentSettings: ExtensionSettings = {}

  currentSettings.useDefaultToggles = configuration.get<ExtensionSettings['useDefaultToggles']>('useDefaultToggles')

  await configuration.update('useDefaultToggles', settings.useDefaultToggles, true)

  const configurationSetting = configuration.inspect<ExtensionSettings['toggles']>('toggles')
  currentSettings.toggles = languageId ? configurationSetting?.globalLanguageValue : configurationSetting?.globalValue

  await configuration.update('toggles', settings.toggles, true, languageId ? true : false)

  return currentSettings
}

/**
 * Various type of settings that can be overridden in a test.
 */
interface TestSettings {
  global?: ExtensionSettings
  language?: [string, Omit<ExtensionSettings, 'useDefaultToggles'>][]
}

/**
 * Settings that can be overridden during a test.
 */
interface ExtensionSettings {
  useDefaultToggles?: boolean
  toggles?: string[][]
}
