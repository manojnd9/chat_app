import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['dist', 'dist/**', 'node_modules'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: true,
                process: true,
                __dirname: true,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            '@typescript-eslint/no-unused-vars': ['warn'],
            // "@typescript-eslint/no-explicit-any": "warn", // Prevent use of `any`
            // "@typescript-eslint/explicit-module-boundary-types": "off" // Don't require function return types
        },
    },
];
