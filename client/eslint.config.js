import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'eslint.config.js'] },

  js.configs.recommended,
  tseslint.configs.recommended,
  reactRefresh.configs.vite,

  {
    // React Hooks'ning klassik ikki qoidasi. Plaginning yangi "compiler"
    // qoidalari (immutability, set-state-in-effect va h.k.) React Compiler'ga
    // o'tayotgan loyihalar uchun mo'ljallangan — bu yerda ular yoqilmagan.
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },

  // Prettier bilan to'qnashadigan formatlash qoidalarini o'chiradi — oxirida turishi shart.
  prettier,
);
