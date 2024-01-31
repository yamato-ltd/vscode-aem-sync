// https://code.visualstudio.com/api/working-with-extensions/testing-extension#quick-setup-the-test-cli

const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({ files: 'out/test/**/*.test.js' });
