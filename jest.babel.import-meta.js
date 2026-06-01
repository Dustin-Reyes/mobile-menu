/* eslint-env node */
/**
 * Babel plugin: transforms import.meta to global["import"].meta
 * so Jest (CommonJS) can handle Vite's import.meta.env.* calls.
 * The global is defined in jest.setup.js.
 */
module.exports = function () {
  return {
    visitor: {
      MetaProperty(path) {
        if (
          path.node.meta.name === 'import' &&
          path.node.property.name === 'meta'
        ) {
          path.replaceWithSourceString('global["import"].meta');
        }
      },
    },
  };
};
