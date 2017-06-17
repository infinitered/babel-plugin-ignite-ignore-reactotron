# babel-plugin-ignite-ignore-reactotron

Strip `Reactotron` from production builds for Ignite-based apps (using `ignite-ir-boilerplate`).

# YOLO

**This is beta software.**

Please give it a try and lemme know if it doesn't work for you. It should work on any `ignite-ir-boilerplate`-based Ignite app.  If you have any problems, let me know.  I'd love to create a generic babel plugin for *any* `Reactotron`-based app, not just Ignite.

# Overview

I recommend you don't ship with `Reactotron` since it's a debugging tool. The problem is, you've already installed it as a dev dependency and peppered a bunch of console.tron statements everywhere.

So rather than go any deeper with if statements, this babel plugin will transform your code to ditch `Reactotron` in production.

# Usage

```sh
# via npm
npm i --save-dev babel-plugin-ignite-ignore-reactotron
# via yarn
yard add -D babel-plugin-ignite-ignore-reactotron
```

Modify your `.babelrc` in your home directory to add this plugin.

```json
{
  "presets": ["react-native"],
  "env": {
    "production": {
      "plugins": ["ignite-ignore-reactotron"]
    }
  }
}
```

# Files Affected

1. Everywhere you have `console.tron.log()` or `.display` or `.error` (etc) will be deleted.
1. Everywhere there is a `console.tron` by itself, it will become `false`.
1. `import './App/Config/ReactotronConfig'` will be removed from `index.ios.js` and `index.android.js`.
1. Any `import` or `require` with the word `reactotron` will be removed.
1. `console.tron.overlay(App)` will become `App` in `App/Containers/App.js`
1. `console.tron.createSagaMonitor()` will become `null` in `App/Redux/CreateStore.js`
1. `console.tron.createStore` will become `createStore` in `App/Redux/CreateStore.js`


# Testing First

To give this a trial-run in production mode:

```sh
react-native run-ios --configuration Release
```

# Thanks

* [Richard Evans](https://github.com/rmevans9) for helping me debug the babel env environment.
* [James Kyle](https://github.com/thejameskyle) for the amazing babel [handbook](https://github.com/thejameskyle/babel-handbook).

# Change Log

### 0.3.0 - June 17, 2017

- Fixes `console.tron.log()` calls with a noop to play nice inside catch blocks. ([@skellock](https://github.com/skellock))

### 0.2.0 - June 7, 2017

- Adds recipe for running only in production mode. ([@rmevans9](https://github.com/rmevans9))

### 0.1.0 - June 6, 2017

- Initial release
