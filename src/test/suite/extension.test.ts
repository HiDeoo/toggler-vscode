import { commands, Position, Selection, Uri, window, workspace } from 'vscode'

import { TogglerCommands } from '../../extension'
import { withEditor, assertDocumentTextEqual, testWithCustomSettings } from '../utils'

suite('Toggler Test Suite', () => {
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

  testWithCustomSettings('should respect capitalization only if the first letter is uppercase', () => {
    return withEditor(
      'NaN',
      async (document) => {
        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'null')

        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'undefined')

        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'NaN')
      },
      { global: { toggles: [['NaN', 'null', 'undefined']] } },
    )
  })

  testWithCustomSettings('should not infer letter case if the new word contains at least 1 uppercase letter', () => {
    return withEditor(
      'trim',
      async (document) => {
        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'trimStart')

        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'trimEnd')

        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'trim')
      },
      { global: { toggles: [['trim', 'trimStart', 'trimEnd']] } },
    )
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

  testWithCustomSettings('should not use default toggles if the option is disabled', () => {
    return withEditor(
      'true',
      async (document) => {
        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'true')
      },
      { global: { useDefaultToggles: false } },
    )
  })

  testWithCustomSettings('should replace a global custom toggle', () => {
    return withEditor(
      'aaa',
      async (document) => {
        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'bbb')
      },
      {
        global: { toggles: [['aaa', 'bbb']] },
        language: [['json', { toggles: [['aaa', 'ccc']] }]],
      },
    )
  })

  testWithCustomSettings('should replace a language-specific custom toggle', () => {
    return withEditor(
      'aaa',
      async (document) => {
        await commands.executeCommand(TogglerCommands.Toggle)

        assertDocumentTextEqual(document, 'ccc')
      },
      {
        global: { toggles: [['aaa', 'bbb']] },
        language: [
          ['plaintext', { toggles: [['aaa', 'ccc']] }],
          ['json', { toggles: [['aaa', 'ddd']] }],
        ],
      },
    )
  })

  test('should replace known words in reverse order', () => {
    return withEditor('green', async (document) => {
      await commands.executeCommand(TogglerCommands.ToggleReverse)

      assertDocumentTextEqual(document, 'fuchsia')

      await commands.executeCommand(TogglerCommands.ToggleReverse)

      assertDocumentTextEqual(document, 'purple')

      await commands.executeCommand(TogglerCommands.ToggleReverse)

      assertDocumentTextEqual(document, 'red')

      await commands.executeCommand(TogglerCommands.ToggleReverse)

      assertDocumentTextEqual(document, 'maroon')

      await commands.executeCommand(TogglerCommands.ToggleReverse)

      assertDocumentTextEqual(document, 'gray')

      await commands.executeCommand(TogglerCommands.ToggleReverse)

      // Asserts this loop back to the end of the list.
      assertDocumentTextEqual(document, 'aqua')

      await commands.executeCommand(TogglerCommands.ToggleReverse)

      assertDocumentTextEqual(document, 'blue')
    })
  })

  test('should use a workspace specific custom toggle', async () => {
    const workspaceFolder = workspace.workspaceFolders?.[0]

    if (!workspaceFolder) {
      // Skipping the test on the web extension.
      return
    }

    const document = await workspace.openTextDocument(
      Uri.file(`${workspace.workspaceFolders?.[0]?.uri.fsPath}/test.txt`),
    )
    await window.showTextDocument(document)

    await commands.executeCommand(TogglerCommands.Toggle)

    assertDocumentTextEqual(document, 'ppp\n')
  })
})
