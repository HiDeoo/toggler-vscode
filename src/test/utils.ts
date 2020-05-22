import * as assert from 'assert'
import { commands, Position, TextDocument, TextEditor, Uri, window, workspace } from 'vscode'

/**
 * Runs code in an untitled file editor.
 * @param content - The editor initial content.
 * @param run - The code to run in the editor.
 */
export async function withEditor(content: string, run: (doc: TextDocument, editor: TextEditor) => void) {
  const document = await workspace.openTextDocument(Uri.parse('untitled:Toggler'))
  const editor = await window.showTextDocument(document)

  await editor.edit((editBuilder) => {
    editBuilder.insert(new Position(0, 0), content)
  })

  await run(document, editor)

  return commands.executeCommand('workbench.action.closeAllEditors')
}

/**
 * Asserts that the text of a document matches a specific string.
 * @param document - The document.
 * @param expected - The expected content.
 */
export function assertDocumentTextEqual(document: TextDocument, expected: string) {
  assert.equal(document.getText(), expected)
}
