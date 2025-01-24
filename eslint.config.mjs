import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import next from '@next/eslint-plugin-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: globals.browser
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: pluginReact,
      prettier: pluginPrettier
    },
    rules: {
      ...tseslint.configs.recommended.rules, // TypeScript rules
      ...pluginReact.configs.flat.recommended.rules, // React rules
      'react/react-in-jsx-scope': 'off', // React 17+ JSX runtime
      'react/jsx-uses-react': 'off', // React 17+ JSX runtime
      'prettier/prettier': 'error' // Treat Prettier issues as ESLint errors
    },
    settings: {
      react: {
        version: 'detect' // Automatically detect React version
      }
    }
  },
  next.configs.coreWebVitals
];
