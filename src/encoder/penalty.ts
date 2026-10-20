const index = (size: number, row: number, column: number) => row * size + column

export function penalty(modules: Uint8Array, size: number): number {
	let score = 0
	for (let row = 0; row < size; row++) {
		let rowRun = 0
		let columnRun = 0
		let lastRow = -1
		let lastColumn = -1
		for (let column = 0; column < size; column++) {
			const rowValue = modules[index(size, row, column)]
			if (rowValue === lastRow) rowRun++
			else {
				if (rowRun >= 5) score += 3 + rowRun - 5
				lastRow = rowValue
				rowRun = 1
			}
			const columnValue = modules[index(size, column, row)]
			if (columnValue === lastColumn) columnRun++
			else {
				if (columnRun >= 5) score += 3 + columnRun - 5
				lastColumn = columnValue
				columnRun = 1
			}
		}
		if (rowRun >= 5) score += 3 + rowRun - 5
		if (columnRun >= 5) score += 3 + columnRun - 5
	}

	for (let row = 0; row < size - 1; row++)
		for (let column = 0; column < size - 1; column++) {
			const value =
				modules[index(size, row, column)] +
				modules[index(size, row + 1, column)] +
				modules[index(size, row, column + 1)] +
				modules[index(size, row + 1, column + 1)]
			if (value === 0 || value === 4) score += 3
		}

	for (let row = 0; row < size; row++) {
		let horizontal = 0
		let vertical = 0
		for (let column = 0; column < size; column++) {
			horizontal = ((horizontal << 1) & 0x7ff) | modules[index(size, row, column)]
			if (column >= 10 && (horizontal === 0x5d0 || horizontal === 0x05d)) score += 40
			vertical = ((vertical << 1) & 0x7ff) | modules[index(size, column, row)]
			if (column >= 10 && (vertical === 0x5d0 || vertical === 0x05d)) score += 40
		}
	}

	let dark = 0
	for (const value of modules) dark += value
	const balance = Math.floor(Math.abs(dark * 20 - modules.length * 10) / modules.length)
	return score + balance * 10
}
