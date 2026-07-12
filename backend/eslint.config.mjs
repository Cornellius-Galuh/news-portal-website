import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    // Apply to all TS files
    { files: ['src/**/*.ts'] },

    // Ignore build output
    { ignores: ['dist/', 'node_modules/'] },

    // ESLint recommended rules
    js.configs.recommended,

    // TypeScript recommended rules
    ...tseslint.configs.recommended,

    // Prettier integration (disables conflicting rules)
    prettierConfig,

    // Custom rules
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            // Run Prettier as an ESLint rule
            'prettier/prettier': 'error',

            // TypeScript-specific rules
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',

            // General rules
            'no-console': 'warn',
        },
    },
];
