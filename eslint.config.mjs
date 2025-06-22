// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.sst/',
      'packages/web/build/',
      'packages/web/.react-router/',
    ],
  },
  {
    files: [
      '**/*.ts',
      // '**/*.tsx',
    ],
    rules: {
      ...eslint.configs.recommended.rules,
      "no-unused-vars": "off",
    },
    extends: [
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      globals: {
        console: 'readonly',
        __dirname: 'readonly'
      }
    }
  }
);
