import { commands, Position, Selection, window } from 'vscode'

import { TogglerCommands } from '../../extension'
import { withEditor, assertDocumentTextEqual } from '../utils'

suite('Toggler Test Suite', () => {
  window.showInformationMessage('Start all tests.')

  test('should replace known words', () => {
    return withEditor('gray', async (document) => {
      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'maroon')

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'red')

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'purple')
    })
  })

  test('should not replace an unknown word', () => {
    const unknownWord = 'sdjflksdjfsjd'

    return withEditor(unknownWord, async (document) => {
      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, unknownWord)
    })
  })

  test('should replace and respect lowercase', () => {
    return withEditor('true', async (document) => {
      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'false')
    })
  })

  test('should replace and respect uppercase', () => {
    return withEditor('TRUE', async (document) => {
      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'FALSE')
    })
  })

  test('should replace and respect capitalization', () => {
    return withEditor('True', async (document) => {
      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'False')
    })
  })

  test('should replace no matter the cursor position', async () => {
    const word = 'true'

    for (let character = 0; character < word.length; character++) {
      await withEditor(word, async (document, editor) => {
        const position = new Position(0, character)
        editor.selection = new Selection(position, position)

        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'false')
      })
    }
  })

  test('should replace with selected text', () => {
    return withEditor('true', async (document, editor) => {
      editor.selection = new Selection(new Position(0, 0), new Position(0, 4))

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'false')
    })
  })

  test('should replace the selected text over a guess based on the cursor position', () => {
    return withEditor('true', async (document, editor) => {
      editor.selection = new Selection(new Position(0, 0), new Position(0, 2))

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'tdue')
    })
  })

  test('should properly guess the word to replace based on the cursor position', () => {
    return withEditor('test', async (document, editor) => {
      const selection = new Selection(new Position(0, 2), new Position(0, 2))
      editor.selection = selection

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'test.only')

      editor.selection = selection

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'test')
    })
  })

  test('should properly guess the word to replace when the cursor is around the word', () => {
    return withEditor('test', async (document, editor) => {
      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'test.only')

      editor.selection = new Selection(new Position(0, 9), new Position(0, 9))

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'test')
    })
  })

  test('should not guess a word to replace in a range not including the cursor position', () => {
    return withEditor('true', async (document, editor) => {
      editor.selection = new Selection(new Position(0, 5), new Position(0, 5))

      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, 'true')
    })
  })

  test('should replace symbols', () => {
    return withEditor("'", async (document) => {
      await commands.executeCommand(TogglerCommands.Toggle)

      assertDocumentTextEqual(document, '"')
    })
  })
})
