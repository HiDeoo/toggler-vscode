import { commands, ExtensionContext, Range, Selection, TextEditor, window, workspace } from 'vscode'

import * as defaults from './defaults.json'

/**
 * Toggler command identifiers.
 */
export const TogglerCommands = {
  Toggle: 'extension.toggle',
  Settings: 'extension.toggle.settings',
} as const

/**
 * RegExp special characters.
 */
const RegExpCharacters = /[|\\{}()[\]^$+*?.]/g

/**
 * Toggler configuration.
 */
let configuration: ToggleConfiguration[] | undefined

/**
 * Triggered when the extension is activated (the very first time the command is executed).
 * @param context - The extension context.
 */
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(TogglerCommands.Toggle, () => {
      loadConfiguration()

      return toggle()
    }),
    commands.registerCommand(TogglerCommands.Settings, () => {
      commands.executeCommand('workbench.action.openSettings', '@ext:hideoo.toggler')
    })
  )
}

/**
 * Triggered when the extension is deactivated.
 */
export function deactivate() {
  configuration = undefined
}

/**
 * Loads the configuration.
 */
export function loadConfiguration() {
  if (configuration) {
    return
  }

  const customToggles = workspace.getConfiguration('toggler').get<ToggleConfiguration[]>('toggles', [])

  configuration = customToggles.concat(defaults)
}

/**
 * Toggles words.
 */
function toggle() {
  const editor = window.activeTextEditor

  if (!editor) {
    return
  }

  const selections = editor.selections

  return editor.edit((editBuilder) => {
    selections.forEach((selection) => {
      const toggle = getToggle(editor, selection)

      if (toggle.new) {
        if (toggle.range && !toggle.selected) {
          // https://github.com/Microsoft/vscode/issues/32058#issuecomment-322162175
          editBuilder.delete(toggle.range)
          editBuilder.insert(toggle.range.start, toggle.new)
        } else {
          editBuilder.replace(selection, toggle.new)
        }
      } else {
        const details = toggle.selected ? ` for '${editor.document.getText(selection)}'` : ''

        window.showWarningMessage(
          `Toggler: Could not find toggles${details}. You can add one in your VS Code settings.`
        )
      }
    })
  })
}

/**
 * Returns the result of a toggle operation.
 * @param  editor - The TextEditor instance.
 * @param  selection - The selection in the editor to find a toggle for.
 * @return The result of the toggle operation.
 */
function getToggle(editor: TextEditor, selection: Selection): Toggle {
  let lineText: string | undefined

  let word = editor.document.getText(selection)
  const selected = word.length > 0
  const cursorPosition = selection.active

  const toggle: Toggle = {
    selected,
  }

  if (!configuration) {
    return toggle
  }

  if (!selected) {
    lineText = editor.document.lineAt(cursorPosition).text
  }

  for (let i = 0; i < configuration.length; i++) {
    const words = configuration[i]

    for (let j = 0; j < words.length; j++) {
      const currentWord = words[j]
      const nextWordIndex = (j + 1) % words.length

      if (!selected && lineText) {
        const regexp = new RegExp(escapeStringRegExp(currentWord), 'ig')

        let match

        while ((match = regexp.exec(lineText)) !== null) {
          const matchRange = new Range(cursorPosition.line, match.index, cursorPosition.line, regexp.lastIndex)

          if (matchRange.contains(cursorPosition) === true) {
            word = match[0]

            toggle.range = matchRange

            break
          }
        }
      }

      const lowerCaseCurrentWord = currentWord.toLowerCase()

      if (word.toLowerCase() === lowerCaseCurrentWord) {
        if (word === lowerCaseCurrentWord) {
          toggle.new = words[nextWordIndex].toLowerCase()
        } else if (word === currentWord.toUpperCase()) {
          toggle.new = words[nextWordIndex].toUpperCase()
        } else if (word === capitalize(currentWord)) {
          toggle.new = capitalize(words[nextWordIndex])
        } else {
          toggle.new = words[nextWordIndex]
        }

        return toggle
      }
    }
  }

  return toggle
}

/**
 * Capitalizes a string.
 * @param  aString - The string to capitalize.
 * @return The capitalized string.
 */
function capitalize(aString: string) {
  return aString.charAt(0).toUpperCase() + aString.slice(1)
}

/**
 * Escapes RegExp special characters in a string.
 * @param  aString - The string to escape.
 * @return The escaped string.
 * @see https://github.com/sindresorhus/escape-string-regexp
 */
function escapeStringRegExp(aString: string) {
  return aString.replace(RegExpCharacters, '\\$&')
}

/**
 * Toggle configuration.
 */
type ToggleConfiguration = string[]

/**
 * Toggle operation result.
 */
type Toggle = {
  // Defines if the toggle is based on a user selection or guessed on a cursor position.
  selected: boolean
  // Range of the toggled words when the toggle is based on a cursor position.
  range?: Range
  // The new word if any.
  new?: string
}
