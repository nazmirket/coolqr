module.exports = {
	semi: false,
	singleQuote: true,
	useTabs: true,
	tabWidth: 2,
	printWidth: 90,
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'avoid',
	htmlWhitespaceSensitivity: 'strict',
	overrides: [
		{
			files: '**/*.hbs',
			options: {
				parser: 'html',
			},
		},
	],
}
