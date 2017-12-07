const vscode = require('vscode');

const defaults = require('./defaults.json');

/**
 * RegExp special characters.
 * @type {RegExp}
 */
const RegExpCharacters = /[|\\{}()[\]^$+*?.]/g;

/**
 * Toggler configuration.
 * @type {?string[][]}
 */
let configuration

/**
 * Activates the extension.
 */
exports.activate = context => {
  let disposable = vscode.commands.registerCommand('extension.toggle', () => {
    toggle()
  });

  context.subscriptions.push(disposable);

  loadConfiguration()
};

/**
 * Deactivates the extensions.
 */
exports.deactivate = () => {
  configuration = undefined;
};

/**
 * Toggles words.
 */
function toggle() {
  const editor = vscode.window.activeTextEditor;

  if (editor === undefined) {
    return;
  }

  const selections = editor.selections;

  editor.edit(editBuilder => {
    selections.forEach(selection => {
      const toggle = getToggle(editor, selection)

      if (toggle.next !== null) {
        if (toggle.selected === true) {
          editBuilder.replace(selection, toggle.next)
        } else {
          // https://github.com/Microsoft/vscode/issues/32058#issuecomment-322162175
          editBuilder.delete(toggle.range);
          editBuilder.insert(toggle.range.start, toggle.next);
        }
      } else {
        const details = toggle.selected ? ` for '${editor.document.getText(selection)}'` : '';

        vscode.window.showWarningMessage(`Toggler: Could not find toggles${details}. You can add one in your VS Code settings.`);
      }
    })
  })
}

/**
 * Returns the result of a toggle operation.
 * @param  {TextEditor} editor - The TextEditor instance.
 * @param  {Selection} selection - The selection in the editor to find a toggle for.
 * @return {Toggle} The result of the toggle operation.
 */
function getToggle(editor, selection) {
  let lineText;

  let word = editor.document.getText(selection);
  const selected = word.length > 0;
  const cursorPosition = selection.active;

  const result = {
    next: null,
    selected,
  };

  if (selected === false) {
    lineText = editor.document.lineAt(cursorPosition).text;
  }

  for (let i = 0; i < configuration.length; i++) {
    const group = configuration[i];

    for (let j = 0; j < group.length; j++) {
      const currentWord = group[j];
      const nextWordIndex = (j + 1) % group.length;

      if (selected === false) {
        const regexp = new RegExp(escapeStringRegExp(currentWord), 'ig');

        let match;

        while ((match = regexp.exec(lineText)) !== null) {
          const matchRange = new vscode.Range(cursorPosition.line, match.index, cursorPosition.line, regexp.lastIndex)

          if (matchRange.contains(cursorPosition) === true) {
            word = match[0];

            result.range = matchRange;

            break;
          }
        }
      }

      if (word.toLowerCase() === currentWord.toLowerCase()) {
        if (word === currentWord.toLowerCase()) {
          result.next = group[nextWordIndex].toLowerCase();
        } else if (word === currentWord.toUpperCase()) {
          result.next = group[nextWordIndex].toUpperCase();
        } else if (word === capitalize(currentWord)) {
          result.next = capitalize(group[nextWordIndex]);
        } else {
          result.next = group[nextWordIndex];
        }

        return result;
      }
    }
  }

  return result;
}

exports.getToggle = getToggle

/**
 * Loads the configuration.
 */
function loadConfiguration() {
  if (configuration !== undefined) {
    return;
  }

  const customToggles = vscode.workspace.getConfiguration('toggler').get('toggles', []);

  if (customToggles === undefined) {
    configuration = defaults;
  } else {
    configuration = customToggles.concat(defaults)
  }
}

exports.loadConfiguration = loadConfiguration

 /**
 * Capitalizes a string.
 * @param  {string} string - The string to capitalize.
 * @return {string} The capitalized string.
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Escapes RegExp special characters in a string.
 * @param  {string} string - The string to escape.
 * @return {string} The escaped string.
 * @see https://github.com/sindresorhus/escape-string-regexp
 */
function escapeStringRegExp(string) {
  return string.replace(RegExpCharacters, '\\$&');
}

/**
 * @typedef Toggle
 * @type {Object}
 * @property {boolean} selected - Defines if the toggle is based on a user selection or guessed on a cursor position.
 * @property {?Range} range - Range of the toggled words when the toggle is based on a cursor position.
 * @property {?string} next - The next toggle.
 */
