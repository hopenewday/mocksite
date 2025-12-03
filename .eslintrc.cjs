module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
      node: true,
      alias: { map: [['@', './src']], extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'] }
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  ],
  plugins: ['vue', '@typescript-eslint', 'import'],
  rules: {
    'import/no-unresolved': ['error', { ignore: ['^virtual:pwa-register$'] }],
    'import/named': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
