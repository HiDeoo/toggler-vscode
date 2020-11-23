import * as assert from 'assert'
import { commands, Position, TextDocument, TextEditor, Uri, window, workspace } from 'vscode'

/**
 * Runs code in an untitled file editor.
 * @param content - The editor initial content.
 * @param run - The code to run in the editor.
 * @param settings - The settings to use when running the code.
 */
export async function withEditor(
  content: string,
  run: (doc: TextDocument, editor: TextEditor) => void,
  settings?: ExtensionSettings
) {
  const document = await workspace.openTextDocument(Uri.parse('untitled:Toggler'))
  const editor = await window.showTextDocument(document)

  let currentSettings: ExtensionSettings | undefined

  if (settings) {
    currentSettings = await setSettings(settings)
  }

  await editor.edit((editBuilder) => {
    editBuilder.insert(new Position(0, 0), content)
  })

  await run(document, editor)

  if (settings && currentSettings) {
    await setSettings(currentSettings)
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
 * Updates settings and returns the previous ones before the update.
 * @param settings - The new settings.
 */
async function setSettings(settings: ExtensionSettings): Promise<ExtensionSettings> {
  const currentSettings: ExtensionSettings = {}
  const togglerConfiguration = workspace.getConfiguration('toggler')

  if (typeof settings.useDefaultToggles !== 'undefined') {
    currentSettings.useDefaultToggles = togglerConfiguration.get<boolean>('useDefaultToggles')

    await togglerConfiguration.update('useDefaultToggles', settings.useDefaultToggles, true)
  }

  return currentSettings
}

/**
 * Settings that can be overridden during a test.
 */
interface ExtensionSettings {
  useDefaultToggles?: boolean
}
