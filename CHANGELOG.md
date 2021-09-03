# Change Log

## 0.3.0

The extension can now be used when Visual Studio Code runs as an editor in the browser, for example with [github.dev](https://github.dev), when pressing `.` (the period key) while checking code on [GitHub](https://github.com/).

### 🚀 New Feature

- Add support for running in an extension host in the browser.
- Add support for [Workspace Trust](https://code.visualstudio.com/docs/editor/workspace-trust). The extension is fully supported in Restricted Mode as it does not need Workspace Trust to perform any functionality.
- The extension is now available on [the Open VSX Registry](https://open-vsx.org/extension/hideoo/toggler) for VS Code compatible editors like VSCodium.

## 0.2.0

The extension now requires at least [Visual Studio Code 1.42.0 _(January 2020)_](https://code.visualstudio.com/updates/v1_42).

### 🚀 New Feature

- Add support for [language-specific](https://code.visualstudio.com/docs/getstarted/settings#_languagespecific-editor-settings) custom toggles.

### 🐛 Bug Fix

- Prevent reloading the extension configuration when unrelated Visual Studio Code settings are modified.

## 0.1.1

### 🚀 New Feature

- Add a new _Customize toggles_ command in the Command Palette to quickly edit custom toggles.
- Customizing toggles no longer requires to reload the VSCode window for the changes to take effect.
- [Default toggles](https://raw.githubusercontent.com/HiDeoo/toggler-vscode/master/src/defaults.json) can now be disabled if they don't fit your preferences.
- Add various [React hooks](https://reactjs.org/docs/hooks-reference.html) to the default toggles list.

### 🐛 Bug Fix

- Fix some default toggles order.
- Fix an issue with the _Toggle_ command not appearing in the Command Palette.
- Trigger only 1 notification when failing to toggle multiple words with multiple cursors.
- The default _Toggle_ shortcut is no longer triggered if the text in an editor doesn't have focus.

### ⚙️ Internal

- Complete TypeScript rewrite with more reliable tests.

## 0.0.3

- Fix changelog versionning.

## 0.0.2

- Update Marketplace UI.

## 0.0.1

- First release.
