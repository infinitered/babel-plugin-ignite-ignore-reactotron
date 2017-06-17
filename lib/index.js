module.exports = function (babel) {
  const t = babel.types

  return {
    visitor: {
      ImportDeclaration (path, state) {
        // -=-=-=-=-=-=-=-=-=-=-=-=-=
        // nuke all import statements with the word reactotron (including our ReactotronConfig)
        // -=-=-=-=-=-=-=-=-=-=-=-=-=
        const value = path.node.source.value
        if (
          value &&
          value.toLowerCase &&
          value.toLowerCase().indexOf('reactotron') >= 0
        ) {
          path.remove()
        }
      }, // ImportDeclaration

      CallExpression (path, state) {
        // -=-=-=-=-=-=-=-=-=-=-=-=-=
        // require('reactotron-*') get nuked
        // -=-=-=-=-=-=-=-=-=-=-=-=-=
        if (
          path.node.callee.name === 'require' &&
          path.node.arguments.length > 0 &&
          path.node.arguments[0].value &&
          path.node.arguments[0].value.indexOf('reactotron-') >= 0
        ) {
          path.parentPath.parentPath.remove()
        }
      }, // CallExpression

      // identifiers (function names, variable names, properties, etc)
      Identifier (path, state) {
        if (path.node.name !== 'tron') return

        const pPath = path.parentPath
        const ppPath = pPath.parentPath
        const pppPath = ppPath.parentPath

        // -=-=-=-=-=-=-=-=-=-=-=-=-=
        // is this `console.tron`?
        // -=-=-=-=-=-=-=-=-=-=-=-=-=
        if (
          pPath.node.type === 'MemberExpression' &&
          pPath.node.computed === false &&
          pPath.node.object.type === 'Identifier' &&
          pPath.node.object.name === 'console'
        ) {
          if (!ppPath.node.property) {
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            // is this `console.tron` by itself?  (used in conditional expressions)
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            ppPath.replaceWith(t.booleanLiteral(false))
          } else if (ppPath.node.property.name === 'createSagaMonitor') {
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            // `console.tron.createSagaMonitor()` becomes null
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            pppPath.replaceWith(t.expressionStatement(t.nullLiteral()))
          } else if (ppPath.node.property.name === 'createStore') {
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            // `console.tron.createStore`
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            // TODO(steve): detect
            if (pppPath.node.type === 'ConditionalExpression') {
              // ternaries will be replaced with the thing after the :
              // TODO(steve): detect if if it's the conditional or alternate
              pppPath.replaceWith(pppPath.node.alternate)
            } else {
              // TODO(steve): detect if redux is even in the file
              pppPath.replaceWithSourceString('createStore')
            }
          } else if (ppPath.node.property.name === 'overlay') {
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            // console.tron.overlay(Thing) becomes Thing
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            pppPath.replaceWith(pppPath.node.arguments[0])
          } else {
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            // console.tron.something -- like log, display, etc
            //   replace it with a no-op expression so it doesn't break
            //   catch() statements.
            //
            //   TODO(steve): build our own functionDeclaration because
            //   this isn't the nicest way to achieve this in babel.
            // -=-=-=-=-=-=-=-=-=-=-=-=-=
            pppPath.replaceWithSourceString('(() => false)()')
          }
        } // Identifier
      } // console.tron

    } // visitor
  } // return
}
