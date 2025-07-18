module.exports = {
	apps: [
		{
			name: 'coolqr',
			port: 9491,
			exec_mode: 'cluster',
			instances: 1,
			script: './.output/server/index.mjs',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
