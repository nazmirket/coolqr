module.exports = {
	root: true,
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['@typescript-eslint', 'prettier'],
	ignorePatterns: ['node_modules', 'dist', 'demo', 'resources', 'public'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'prettier/prettier': 'error',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-explicit-any': 'off',
		'no-console': 'error',
		'arrow-parens': ['error', 'as-needed'],
	},
	overrides: [
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
	],
}
