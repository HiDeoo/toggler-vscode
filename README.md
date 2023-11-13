<div align="center">
  <img alt="Toggler extension icon" src="https://i.imgur.com/LfHZMK4.png" width="128" />
  <h1>Toggler</h1>
</div>

<div align="center">
  <p><strong>Toggle words and symbols in VS Code using a user defined configuration.</strong></p>
  <p>
    <a href="https://github.com/HiDeoo/toggler-vscode/actions?query=workflow%3Aintegration">
      <img alt="Integration Status" src="https://github.com/HiDeoo/toggler-vscode/workflows/integration/badge.svg">
    </a>
    <a href="https://github.com/HiDeoo/toggler-vscode/blob/main/LICENSE.md">
      <img alt="License" src="https://badgen.net/github/license/hideoo/toggler-vscode" />
    </a>
  </p>
  <p>
    <a href="https://i.imgur.com/mBAqejd.gif" title="Demo of the Toggler extension">
      <img alt="Demo of the Toggler extension" src="https://i.imgur.com/mBAqejd.gif" width="458" />
    </a>
  </p>
</div>

## Features

A word and symbol toggling extension for Visual Studio Code with the following features:

- **Easily user customizable.**
- Maintain word case.
- Multiple toggles support.
- Multiple cursors support.
- Multiple selections support.
- No dependency.

## Usage

Set your cursor on a word or select a word and press the associated keybinding (<kbd>Ctrl</kbd>+<kbd>r</kbd> by default on macOS, <kbd>Alt</kbd>+<kbd>r</kbd> on Windows and Linux).

You can also use the VS Code Command Palette and choose the `Toggle` command, or use the `Toggle` action in a context menu. A `Toggle Reverse` command is also available to toggle to the previous word instead of the next one.

## Configuration

You can customize the default configuration directly in your VS Code settings or using the `Customize toggles` command:

```json
"toggler.toggles": [
  [
    "custom_1",
    "custom_2"
  ],
  [
    "custom_3",
    "custom_4"
  ]
]
```

Toggler is bundled with these default toggles:

```json
[
  ["absolute", "relative"],
  ["high", "low"],
  ["horizontal", "vertical"],
  ["inner", "outer"],
  ["left", "right"],
  ["top", "bottom"],
  ["ltr", "rtl"],

  ["black", "white"],
  ["gray", "maroon", "red", "purple", "fuchsia", "green", "yellow", "blue", "aqua"],

  ["const", "let", "var"],
  ["import", "export"],
  ["join", "split"],
  ["JSON.parse", "JSON.stringify"],
  ["parse", "stringify"],
  ["pop", "push"],
  ["unshift", "shift"],
  ["test.only", "test"],
  ["describe.only", "describe"],
  ["interface", "type"],

  ["onAnimationStart", "onAnimationEnd"],
  ["onChange", "onInput", "onSubmit"],
  ["onClick", "onDoubleClick"],
  ["onCompositionStart", "onCompositionEnd"],
  ["onCopy", "onCut", "onPaste"],
  ["onDragEnter", "onDragLeave"],
  ["onDragStart", "onDragEnd"],
  ["onFocus", "onBlur"],
  ["onKeyDown", "onKeyUp"],
  ["onMouseDown", "onMouseUp"],
  ["onMouseEnter", "onMouseLeave"],
  ["onTouchStart", "onTouchEnd"],
  ["addEventListener", "removeEventListener"],
  ["animationstart", "animationend"],
  ["change", "input", "submit"],
  ["dblclick", "click"],
  ["compositionstart", "compositionend"],
  ["copy", "cut", "paste"],
  ["dragenter", "dragleave"],
  ["dragstart", "dragend"],
  ["focus", "blur"],
  ["keydown", "keyup"],
  ["mousedown", "mouseup"],
  ["mouseenter", "mouseleave"],
  ["touchstart", "touchend"],

  ["componentDidMount", "componentDidUpdate", "componentWillUnmount"],
  ["useState", "useEffect", "useContext", "useMemo", "useRef", "useReducer", "useCallback"],
  ["getState", "setState"],
  ["container", "component"],

  ["atan", "tan"],
  ["ceil", "floor"],
  ["cos", "sin"],
  ["Math.atan", "Math.tan"],
  ["Math.ceil", "Math.floor"],
  ["Math.cos", "Math.sin"],
  ["Math.min", "Math.max"],
  ["min", "max"],

  ["deactivate", "activate"],
  ["address", "port"],
  ["add", "remove"],
  ["unavailable", "available"],
  ["background", "foreground"],
  ["before", "after"],
  ["client", "server"],
  ["disconnected", "connected"],
  ["disconnect", "connect"],
  ["development", "production"],
  ["dev", "prod"],
  ["drag", "drop"],
  ["file", "folder"],
  ["first", "last"],
  ["from", "to"],
  ["get", "set"],
  ["input", "output"],
  ["uninstall", "install"],
  ["all", "each", "only"],
  ["key", "value"],
  ["unload", "load"],
  ["minor", "major"],
  ["online", "offline"],
  ["open", "close"],
  ["parent", "child"],
  ["positive", "negative"],
  ["prefix", "suffix"],
  ["previous", "next"],
  ["public", "private", "protected"],
  ["request", "response"],
  ["req", "res"],
  ["row", "column"],
  ["short", "long"],
  ["show", "hide"],
  ["source", "destination"],
  ["start", "stop"],
  ["invalid", "valid"],
  ["visible", "hidden"],
  ["width", "height"],
  ["x", "y"],

  ["0", "1"],
  ["enabled", "disabled"],
  ["enable", "disable"],
  ["if", "else"],
  ["on", "off"],
  ["true", "false"],
  ["yes", "no"],

  ["div", "span"],
  ["head", "body"],
  ["header", "footer"],
  ["ol", "ul"],
  ["tr", "td"],

  ["in", "out"],
  ["up", "down"],

  ["[]", "{}"],
  ["(", ")"],
  ["[", "]"],
  ["{", "}"],
  ["'", "\"", "`"],

  ["*=", "/="],
  ["*", "/"],
  ["&&", "||"],
  ["&", "|"],
  ["++", "--"],
  ["+=", "-="],
  ["+", "-"],
  ["<<", ">>"],
  ["<=", ">="],
  ["<", ">"],
  ["===", "!=="],
  ["==", "!="]
]
```

If these default toggles don't fit your preferences, you can disable them in your settings to only use custom toggles.

## License

Licensed under the MIT License, Copyright © HiDeoo.

See [LICENSE](https://github.com/HiDeoo/toggler-vscode/blob/master/LICENSE) for more information.
