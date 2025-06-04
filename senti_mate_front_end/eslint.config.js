import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';

/**
 * SentiMate Frontend ESLint Configuration
 *
 * This configuration is optimized for the SentiMate project, a health diary web application
 * built with React, Redux, and React Router.
 *
 * Note: It's recommended to add eslint-plugin-react as a dependency for better React linting.
 * Run: npm install --save-dev eslint-plugin-react
 */
export default [
  // Ignore build output
  { ignores: ['dist', 'node_modules', 'coverage'] },

  // JavaScript and JSX files configuration
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest, // Add Jest globals for testing
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettier,
    },
    rules: {
      // Base ESLint rules
      ...js.configs.recommended.rules,

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Variable rules
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Prettier integration
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      // Console and debugging
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // Code style
      semi: ['error', 'always'],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      indent: ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'as-needed'],
      'max-len': [
        'warn',
        {
          code: 100,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],

      // Object and array formatting
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],

      // Best practices
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'no-param-reassign': [
        'warn',
        { props: true, ignorePropertyModificationsFor: ['state'] },
      ],

      // JSX specific rules
      'jsx-quotes': ['error', 'prefer-double'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Test files configuration - more relaxed rules
  {
    files: [
      '**/*.test.{js,jsx}',
      '**/__tests__/**/*.{js,jsx}',
      '**/tests/**/*.{js,jsx}',
    ],
    rules: {
      'no-console': 'off',
      'max-len': 'off',
      'no-unused-expressions': 'off',
    },
  },
];
