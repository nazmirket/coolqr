module.exports = {
	theme: {
		screens: {
			sm: '600px',
			md: '900px',
			lg: '1200px',
			xl: '1600px',
		},

		extend: {
			colors: {
				primary: {
					50: '#efeeff',
					100: '#e2e0ff',
					200: '#cac7fe',
					300: '#aaa5fc',
					400: '#8881f8',
					500: '#6b63f1',
					600: '#4f46e5',
					700: '#4038ca',
					800: '#3730a3',
					900: '#332e81',
					950: '#1e1b4b',
				},
				dark: '#0F172A',
			},

			fontWeight: {
				100: '100',
				200: '200',
				300: '300',
				400: '400',
				500: '500',
				600: '600',
				700: '700',
				800: '800',
				900: '900',
			},
		},
	},

	plugins: [],

	content: ['./pages/**/*.vue', './nuxt.config.{js,ts}'],
}
