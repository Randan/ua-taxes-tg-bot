module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'object-curly-spacing': ['error', 'always'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    indent: [
      'error',
      2,
      { ignoredNodes: ['ConditionalExpression'], SwitchCase: 1 }
    ],
    semi: ['error', 'always'],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'jsx-quotes': ['error', 'prefer-single'],
    'multiline-ternary': 'off',
    'prefer-const': 'error',
    'no-unused-vars': 'warn',
    camelcase: 'off'
  }
};
