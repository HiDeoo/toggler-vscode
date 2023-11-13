import { commands, type ExtensionContext, Range, type Selection, type TextEditor, window, workspace } from 'vscode'

import defaults from './defaults.json'

/**
 * Toggler command identifiers.
 */
export const TogglerCommands = {
  Toggle: 'extension.toggle',
  ToggleReverse: 'extension.toggle-reverse',
  Settings: 'extension.toggle.settings',
} as const

/**
 * RegExp special characters.
 */
const RegExpCharacters = /[$()*+.?[\\\]^{|}]/g

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
    commands.registerCommand(TogglerCommands.ToggleReverse, () => {
      if (!window.activeTextEditor) {
        return
      }

      loadConfiguration()

      return toggle(true)
    }),
    commands.registerCommand(TogglerCommands.Settings, () => {
      openTogglerSettings()
    }),
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('toggler')) {
        resetConfiguration()
      }
    }),
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

  if (configuration?.[languageId]) {
    return
  }

  if (!configuration) {
    configuration = {}
  }

  let customToggles: ToggleConfiguration[] = []

  const togglerConfiguration = workspace.getConfiguration('toggler', window.activeTextEditor.document)

  const useDefaultToggles = togglerConfiguration.get<boolean>('useDefaultToggles', true)
  const customTogglesInfos = togglerConfiguration.inspect<ToggleConfiguration[]>('toggles')

  if (customTogglesInfos) {
    if (customTogglesInfos.globalLanguageValue) {
      customToggles = customTogglesInfos.globalLanguageValue
    } else if (customTogglesInfos.globalValue) {
      customToggles = customTogglesInfos.globalValue
    }
  }

  configuration[languageId] = useDefaultToggles ? [...customToggles, ...defaults] : customToggles
}

/**
 * Opens the Toggler settings.
 */
function openTogglerSettings() {
  void commands.executeCommand('workbench.action.openSettings', '@ext:hideoo.toggler')
}

/**
 * Toggles words.
 */
function toggle(reverse = false) {
  const editor = window.activeTextEditor

  if (!editor) {
    return
  }

  const selections = editor.selections

  return editor.edit(async (editBuilder) => {
    let didFail = false

    for (const selection of selections) {
      const toggle = getToggle(editor, selection, reverse)

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
    }

    if (didFail) {
      const togglerConfiguration = workspace.getConfiguration('toggler', window.activeTextEditor?.document)
      const showToggleFailureNotification = togglerConfiguration.get<boolean>('showToggleFailureNotification', true)

      if (!showToggleFailureNotification) {
        return
      }

      const settingsButton = 'Open Settings'

      const result = await window.showWarningMessage(
        `Toggler: Could not find a toggle. You can add one in your VS Code settings.`,
        settingsButton,
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
function getToggle(editor: TextEditor, selection: Selection, reverse = false): Toggle {
  let lineText: string | undefined

  let word = editor.document.getText(selection)
  const selected = word.length > 0
  const cursorPosition = selection.active

  const toggle: Toggle = {
    selected,
  }

  if (!configuration?.[editor.document.languageId]) {
    return toggle
  }

  const languageConfiguration = configuration[editor.document.languageId]

  if (!selected) {
    lineText = editor.document.lineAt(cursorPosition).text
  }

  for (const words of languageConfiguration ?? []) {
    for (let j = 0; j < words.length; j++) {
      const currentWord = words[j]

      if (!currentWord) {
        continue
      }

      const nextWordIndex = reverse ? (j - 1 + words.length) % words.length : (j + 1) % words.length

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
        const nextWord = words[nextWordIndex]

        if (!nextWord) {
          return toggle
        }

        const nextWordHasUppercase = /[A-Z]/.test(nextWord)

        if (!nextWordHasUppercase && word === lowerCaseCurrentWord) {
          toggle.new = nextWord.toLowerCase()
        } else if (!nextWordHasUppercase && word === currentWord.toUpperCase()) {
          toggle.new = nextWord.toUpperCase()
        } else if (!nextWordHasUppercase && word === capitalize(currentWord)) {
          toggle.new = capitalize(nextWord)
        } else {
          toggle.new = nextWord
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
  return aString.charAt(0).toUpperCase() + aString.slice(1).toLowerCase()
}

/**
 * Escapes RegExp special characters in a string.
 * @param  aString - The string to escape.
 * @return The escaped string.
 * @see https://github.com/sindresorhus/escape-string-regexp
 */
function escapeStringRegExp(aString: string) {
  return aString.replaceAll(RegExpCharacters, '\\$&')
}

/**
 * Toggle configuration.
 */
type ToggleConfiguration = string[]

/**
 * Toggle operation result.
 */
interface Toggle {
  // Defines if the toggle is based on a user selection or guessed on a cursor position.
  selected: boolean
  // Range of the toggled words when the toggle is based on a cursor position.
  range?: Range
  // The new word if any.
  new?: string
}
