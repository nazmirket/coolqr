module.exports = {
	root: true,
	env: {
		browser: true,
	},
	extends: ['eslint:recommended', 'plugin:n/recommended'],
	plugins: ['prettier'],
	ignorePatterns: ['node_modules', 'tests', 'resources', 'public'],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'prettier/prettier': 'error',
		'no-unused-vars': 'warn',
		'no-console': 'warn',
		'arrow-parens': ['error', 'as-needed'],
	},
}
