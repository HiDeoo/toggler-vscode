/* global suite, test, suiteSetup */

const assert = require('assert');
const vscode = require('vscode');

const toggler = require('../src/toggler');

/**
 * Mocks an editor.
 * @param {string} word - The selected text.
 * @param {string} line - The whole line.
 */
function mockEditor(word, line) {
  return {
    document: {
      getText: () => {
        return word;
      },
      lineAt: () => {
        return {
          text: line,
        };
      },
    },
  };
}

/**
 * Mocks a selection.
 * @param {number} character - The charecter position.
 */
function mockSelection(character = 0) {
  return {
    active: new vscode.Position(0, character)
  };
}

/**
 * Mocks a toggle.
 * @param {string} next - The next toggle.
 * @param {boolean} selected - Defines if something was selected.
 */
function mockToggle(next, selected) {
  return { next: next, selected: selected };
}

suite('Toggler', () => {
  suite('getToggle()', () => {
    suiteSetup(() => {
      toggler.loadConfiguration();
    });

    test('should replace a known word', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('true'), mockSelection()), mockToggle('false', true));
    });

    test('should not replace an unknown word', () => {
      const word = 'sdjflksdjfsjd';

      assert.deepEqual(toggler.getToggle(mockEditor(word), mockSelection()), mockToggle(null, true));
    });

    test('should replace and respect lowercase', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('true'), mockSelection()), mockToggle('false', true));
    });

    test('should replace and respect uppercase', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('TRUE'), mockSelection()), mockToggle('FALSE', true));
    });

    test('should replace and respect capitalization', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('True'), mockSelection()), mockToggle('False', true));
    });

    test('should replace no matter the cursor position', () => {
      assert.equal(toggler.getToggle(mockEditor('', 'true'), mockSelection(0)).next, 'false');
      assert.equal(toggler.getToggle(mockEditor('', 'true'), mockSelection(1)).next, 'false');
      assert.equal(toggler.getToggle(mockEditor('', 'true'), mockSelection(2)).next, 'false');
      assert.equal(toggler.getToggle(mockEditor('', 'true'), mockSelection(3)).next, 'false');
    });

    test('should replace with selected text', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('true'), mockSelection()), mockToggle('false', true));
    });

    test('should always replace the selected text over a guess based on the cursor position', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('tr', 'true'), mockSelection()), mockToggle('td', true));
    });

    test('should properly guess the word to replace based on the cursor position', () => {
      assert.equal(toggler.getToggle(mockEditor('', 'test'), mockSelection(2)).next, 'test.only');
      assert.equal(toggler.getToggle(mockEditor('', 'test.only'), mockSelection(2)).next, 'test');
    });

    test('should properly guess the word to replace when the cursor is around the word', () => {
      assert.equal(toggler.getToggle(mockEditor('', 'test'), mockSelection(0)).next, 'test.only');
      assert.equal(toggler.getToggle(mockEditor('', 'test.only'), mockSelection(9)).next, 'test');
    });

    test('should not guess a word to replace in a range not including the cursor position', () => {
      assert.equal(toggler.getToggle(mockEditor('', 'test something'), mockSelection(5)).next, null);
    });

    test('should replace symbols', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('\''), mockSelection()), mockToggle('"', true));
    });

    test('should replace with multiple toggles', () => {
      assert.deepEqual(toggler.getToggle(mockEditor('\''), mockSelection()), mockToggle('"', true));
      assert.deepEqual(toggler.getToggle(mockEditor('"'), mockSelection()), mockToggle('`', true));
      assert.deepEqual(toggler.getToggle(mockEditor('`'), mockSelection()), mockToggle('\'', true));
    });
  });
});
