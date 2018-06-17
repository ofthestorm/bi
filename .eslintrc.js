// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html',
    'react'
  ],
  // add your custom rules here
  'rules': {
    'comma-dangle': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-multiple-empty-lines': 0,
    'no-mixed-operators': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-mixed-spaces-and-tabs": [0],
    'space-before-function-paren': [0],
    // 关闭语句强制分号结尾
    "semi": [0],
    "indent": [0],//缩进风格
    "vue/no-invalid-v-for": [0],
    "vue/require-v-for-keys": [0],
  }
}
