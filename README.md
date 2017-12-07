# Toggler Extension

[![macOS & Linux Build Status](https://travis-ci.org/HiDeoo/toggler-vscode.svg?branch=master)](https://travis-ci.org/HiDeoo/toggler-vscode)
[![Dependency Status](https://david-dm.org/HiDeoo/toggler-vscode.svg)](https://david-dm.org/HiDeoo/toggler-vscode)

Toggle words and symbols in VS Code using a user defined configuration.

This is the **official** port of the [Atom package](https://atom.io/packages/toggler) of the same name.

![Screenshot of the Toggler Extension](https://i.imgur.com/I2vuYqR.gif)

[Changelog](https://github.com/HiDeoo/toggler-vscode/blob/master/CHANGELOG.md)

## Features

As none of the existing words toggling package were fitting my needs, I decided to write my own with the following features:

  * **Easily user customizable.**
  * Maintain word case.
  * Multiple toggles support.
  * Multiple cursors support.
  * Multiple selections support.
  * No dependency.

## Usage

Set your cursor on a word or select a word and press the associated keybinding (<kbd>Ctrl</kbd>+<kbd>r</kbd> by default on macOS, <kbd>Alt</kbd>+<kbd>r</kbd> on Windows and Linux).

You can also use the VS Code Command Palette and choose the `Toggle` command, or use the `Toggle` action in a context menu.

## Configuration.

You can customize the default configuration directly in your VS Code settings:

```
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

```
[
  ["absolute", "relative"],
  ["high", "low"],
  ["horizontal", "vertical"],
  ["in", "out"],
  ["inner", "outer"],
  ["left", "right"],
  ["top", "bottom"],
  ["up", "down"],

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

  ["componentDidMount", "componentWillUnmount"],
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

  ["activate", "deactivate"],
  ["address", "port"],
  ["add", "remove"],
  ["available", "unavailable"],
  ["background", "foreground"],
  ["before", "after"],
  ["client", "server"],
  ["connected", "disconnected"],
  ["connect", "disconnect"],
  ["development", "production"],
  ["dev", "prod"],
  ["drag", "drop"],
  ["file", "folder"],
  ["first", "last"],
  ["from", "to"],
  ["get", "set"],
  ["input", "output"],
  ["install", "uninstall"],
  ["key", "value"],
  ["load", "unload"],
  ["minor", "major"],
  ["online", "offline"],
  ["open", "close"],
  ["parent", "child"],
  ["positive", "negative"],
  ["prefix", "suffix"],
  ["previous", "next"],
  ["public", "private"],
  ["request", "response"],
  ["req", "res"],
  ["row", "column"],
  ["short", "long"],
  ["show", "hide"],
  ["source", "destination"],
  ["start", "stop"],
  ["valid", "invalid"],
  ["visible", "hidden"],
  ["width", "height"],
  ["x", "y"],

  ["0", "1"],
  ["enabled", "disabled"],
  ["enable", "disable"],
  ["on", "off"],
  ["true", "false"],
  ["yes", "no"],

  ["div", "span"],
  ["head", "body"],
  ["header", "footer"],
  ["ol", "ul"],
  ["tr", "td"],

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

## Copyright and license

Copyright (c) 2017 HiDeoo. Code released under the [MIT license](https://github.com/HiDeoo/toggler-vscode/blob/master/LICENSE.md).
