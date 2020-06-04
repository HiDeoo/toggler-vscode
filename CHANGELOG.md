# Change Log

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
