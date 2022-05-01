module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quotes':'off',
    'semi':'off',
    'comma-dangle':'off',
    'vue/multi-word-component-names':'off',
    'no-unused-vars':'off',
    'vue/no-unused-vars':'off',
    "space-before-function-paren": 0,
    'prefer-const':'off',
    'vue/no-unused-components':'off',
    'no-redeclare':'off',
    'eqeqeq':'off'
  }
}
