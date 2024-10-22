import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      // Override `no-unused-vars` to show warnings instead of errors
      'no-unused-vars': 'warn',
    },
  },
];
