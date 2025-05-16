import js from '@eslint/js';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        extends: [
            tseslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylistic,
            tseslint.configs.stylisticTypeChecked,
        ],
        ignores: ['**/node_modules/*', 'dist/*'],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: '.',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
    },
    {
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        ...js.configs.recommended,
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
);
