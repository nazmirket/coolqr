import eslint from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier/flat'
import nodePlugin from 'eslint-plugin-n'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
	{
		ignores: ['node_modules/**', 'dist/**', 'demo/**', 'resources/**', 'public/**'],
	},
	eslint.configs.recommended,
	...typescriptEslint.configs['flat/recommended'],
	nodePlugin.configs['flat/recommended'],
	{
		files: ['**/*.{js,cjs,mjs,ts}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: typescriptParser,
			globals: {
				...globals.browser,
				...globals.es2022,
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': typescriptEslint,
			n: nodePlugin,
			prettier: prettierPlugin,
		},
		rules: {
			'prettier/prettier': 'error',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'off',
			'no-console': 'error',
			'arrow-parens': ['error', 'as-needed'],
		},
	},
	{
		files: ['**/*.ts'],
		rules: {
			'n/no-missing-import': 'off',
		},
	},
	{
		files: ['tests/*.cjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'n/no-missing-require': 'off',
			'n/no-unsupported-features/node-builtins': 'off',
		},
	},
	{
		files: ['scripts/**/*.mjs'],
		settings: { node: { version: '>=24.0.0' } },
	},
	prettierConfig,
]
