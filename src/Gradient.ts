export function colorStops(colors: readonly string[]): Array<number | string> {
	if (colors.length === 0) return [0, '#000000', 1, '#000000']
	if (colors.length === 1) return [0, colors[0], 1, colors[0]]

	return colors.flatMap((color, index) => [index / (colors.length - 1), color])
}
