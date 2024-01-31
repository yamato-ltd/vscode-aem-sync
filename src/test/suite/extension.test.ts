// https://code.visualstudio.com/api/working-with-extensions/testing-extension#test-scripts
import * as assert from 'assert';

import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  suiteTeardown(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    assert.strictEqual(1, [1, 2, 3].indexOf(2));
  });
});
