# Table-of-contents

Figma 插件，用于生成图层目录

This demonstrates:

- bundling plugin code using Webpack, and
- using React with TSX.

The main plugin code is in `src/code.ts`. The HTML for the UI is in
`src/ui.html`, while the embedded JavaScript is in `src/ui.tsx`.

These are compiled to files in `dist/`, which are what Figma will use to run
your plugin.

To build:

    $ npm install
    $ npx webpack

[webpack]: ../webpack/
