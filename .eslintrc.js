const path = require('path');

module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  parserOptions: {
    // Prevent ESLint's Babel parser from failing when it can't locate babel config.
    requireConfigFile: false,
    babelOptions: {
      configFile: path.join(__dirname, 'babel.config.js'),
    },
  },
};
