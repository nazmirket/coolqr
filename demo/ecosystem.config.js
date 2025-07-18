module.exports = {
	apps: [
		{
			name: 'qr',
			port: '9491',
			exec_mode: 'cluster',
			instances: 'max',
			script: './.output/server/index.mjs',
		},
	],
}
