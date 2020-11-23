import * as assert from 'assert'
import { commands, Position, TextDocument, TextEditor, Uri, window, workspace } from 'vscode'

/**
 * Runs code in an untitled file editor.
 * @param content - The editor initial content.
 * @param run - The code to run in the editor.
 */
export async function withEditor(
  content: string,
  run: (doc: TextDocument, editor: TextEditor) => void,
  customSettings?: CustomSettings
) {
  const document = await workspace.openTextDocument(Uri.parse('untitled:Toggler'))
  const editor = await window.showTextDocument(document)

  const currentSettings: CustomSettings = {}

  if (customSettings) {
    const togglerConfiguration = workspace.getConfiguration('toggler')

    if (typeof customSettings.useDefaultToggles !== 'undefined') {
      currentSettings.useDefaultToggles = togglerConfiguration.get<boolean>('useDefaultToggles')

      await togglerConfiguration.update('useDefaultToggles', customSettings.useDefaultToggles, true)
    }
  }

  await editor.edit((editBuilder) => {
    editBuilder.insert(new Position(0, 0), content)
  })

  await run(document, editor)

  if (customSettings) {
    const togglerConfiguration = workspace.getConfiguration('toggler')

    if (
      typeof customSettings.useDefaultToggles !== 'undefined' &&
      typeof currentSettings.useDefaultToggles !== 'undefined'
    ) {
      await togglerConfiguration.update('useDefaultToggles', currentSettings.useDefaultToggles, true)
    }
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
 * Custom settings that can be used during a test.
 */
interface CustomSettings {
  useDefaultToggles?: boolean
}
