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
let configuration: Record<string, ToggleConfiguration[]> | undefined

/**
 * Triggered when the extension is activated (the very first time the command is executed).
 * @param context - The extension context.
 */
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(TogglerCommands.Toggle, () => {
      if (!window.activeTextEditor) {
        return
      }

      loadConfiguration()

      return toggle()
    }),
    commands.registerCommand(TogglerCommands.Settings, () => {
      openTogglerSettings()
    }),
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('toggler')) {
        resetConfiguration()
      }
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
 * Resets the configuration.
 */
function resetConfiguration() {
  configuration = undefined
}

/**
 * Loads the configuration.
 */
function loadConfiguration() {
  if (!window.activeTextEditor) {
    return
  }

  const languageId = window.activeTextEditor.document.languageId

  if (configuration && configuration[languageId]) {
    return
  }

  if (!configuration) {
    configuration = {}
  }

  let customToggles: ToggleConfiguration[] = []

  const togglerConfiguration = workspace.getConfiguration('toggler', window.activeTextEditor?.document)

  const useDefaultToggles = togglerConfiguration.get<boolean>('useDefaultToggles', true)
  const customTogglesInfos = togglerConfiguration.inspect<ToggleConfiguration[]>('toggles')

  if (customTogglesInfos) {
    if (customTogglesInfos.globalLanguageValue) {
      customToggles = customTogglesInfos.globalLanguageValue
    } else if (customTogglesInfos.globalValue) {
      customToggles = customTogglesInfos.globalValue
    }
  }

  configuration[languageId] = useDefaultToggles ? customToggles.concat(defaults) : customToggles
}

/**
 * Opens the Toggler settings.
 */
function openTogglerSettings() {
  commands.executeCommand('workbench.action.openSettings', '@ext:hideoo.toggler')
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

  return editor.edit(async (editBuilder) => {
    let didFail = false

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
        didFail = true
      }
    })

    if (didFail) {
      const settingsButton = 'Open Settings'

      const result = await window.showWarningMessage(
        `Toggler: Could not find a toggle. You can add one in your VS Code settings.`,
        settingsButton
      )

      if (result === settingsButton) {
        openTogglerSettings()
      }
    }
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

  if (!configuration || !configuration[editor.document.languageId]) {
    return toggle
  }

  const languageConfiguration = configuration[editor.document.languageId]

  if (!selected) {
    lineText = editor.document.lineAt(cursorPosition).text
  }

  for (let i = 0; i < languageConfiguration.length; i++) {
    const words = languageConfiguration[i]

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
