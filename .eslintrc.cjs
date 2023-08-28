require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier', 'vue', '@typescript-eslint'],
  ignorePatterns: ['node_modules/', 'dist/', 'tests/', '.config.js'],
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    'no-undef': 0,
    'vue/valid-v-for': 0,
    quotes: ['warn', 'single'],
    'import/no-unresolved': 0,
    'no-tabs': 0,
    'prettier/prettier': 0,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/array-type': 'error'
  }
}
