module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  plugins: [
    'react-refresh',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'max-len': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/self-closing-comp': 'warn',
    'react/require-default-props': 'off',
    'import/extensions': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    // imports
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/order': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // indents
    'react/jsx-indent': 'off',
    // spaces
    'spaced-comment': 'warn',
    'no-trailing-spaces': 'warn',
    // lines
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'object-curly-newline': 'off',
    'no-multiple-empty-lines': 'warn',
    'react/jsx-props-no-multi-spaces': 'warn',
    // conditions
    'no-else-return': 'off',
    'no-nested-ternary': 'off',
    // functions
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
  },
  parserOptions: {
    project: './tsconfig.json'
  }
}
