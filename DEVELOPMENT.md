# How to run this extension locally

A memo to develop this extension. Please see [the official doc](https://code.visualstudio.com/api/get-started/your-first-extension) too.

Build this extension with webpack (run on a terminal):

```
npm run webpack
```

Run the extension. For example, open `src/extension.js` and hit <kbd>F5</kbd>. A new instance of VS Code will start.

## How to test this extension

A test framework is already configured. Run the test suite with:

```
npm run test-compile &&
npm run test
```

<!-- TODO shouldn't we automate test-compile before test? -->

Please read [the official doc](https://code.visualstudio.com/api/working-with-extensions/testing-extension) too.
