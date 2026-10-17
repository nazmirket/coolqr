import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
	{
		ignores: ['.nuxt/**', '.output/**', 'node_modules/**'],
	},
	...tseslint.configs['flat/recommended'],
	...vue.configs['flat/recommended'],
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tsParser,
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,vue}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			'prettier/prettier': ['error', {}, { usePrettierrc: true }],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'no-console': 'warn',
			'arrow-parens': ['error', 'as-needed'],
			'vue/multi-word-component-names': 'off',
		},
	},
	prettierConfig,
]
