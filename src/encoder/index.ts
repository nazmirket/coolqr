/**
 * A small, dependency-free QR Code Model 2 encoder.
 *
 * The numeric tables in this file are data from the QR Code symbol
 * specification (ISO/IEC 18004), cross-checked against DENSO WAVE's public
 * capacity tables. They are not copied implementation code. The encoder
 * itself follows the symbol construction rules: data encoding, Reed-Solomon
 * block coding, function pattern placement, masking, and BCH format/version
 * information.
 */

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export interface EncodeOptions {
	errorCorrectionLevel?: ErrorCorrectionLevel
	minVersion?: number
	maxVersion?: number
}

export interface QRMatrix {
	size: number
	modules: Uint8Array
	functionModules: Uint8Array
	version: number
	errorCorrectionLevel: ErrorCorrectionLevel
	mask: number
}

type Mode = 'numeric' | 'alphanumeric' | 'byte'

const TOTAL_CODEWORDS = [
	0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815,
	901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465,
	2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706,
]

// Rows are versions 1..40, columns are L, M, Q, H.
const EC_CODEWORDS = [
	[7, 10, 13, 17],
	[10, 16, 22, 28],
	[15, 26, 36, 44],
	[20, 36, 52, 64],
	[26, 48, 72, 88],
	[36, 64, 96, 112],
	[40, 72, 108, 130],
	[48, 88, 132, 156],
	[60, 110, 160, 192],
	[72, 130, 192, 224],
	[80, 150, 224, 264],
	[96, 176, 260, 308],
	[104, 198, 288, 352],
	[120, 216, 320, 384],
	[132, 240, 360, 432],
	[144, 280, 408, 480],
	[168, 308, 448, 532],
	[180, 338, 504, 588],
	[196, 364, 546, 650],
	[224, 416, 600, 700],
	[224, 442, 644, 750],
	[252, 476, 690, 816],
	[270, 504, 750, 900],
	[300, 560, 810, 960],
	[312, 588, 870, 1050],
	[336, 644, 952, 1110],
	[360, 700, 1020, 1200],
	[390, 728, 1050, 1260],
	[420, 784, 1140, 1350],
	[450, 812, 1200, 1440],
	[480, 868, 1290, 1530],
	[510, 924, 1350, 1620],
	[540, 980, 1440, 1710],
	[570, 1036, 1530, 1800],
	[570, 1064, 1590, 1890],
	[600, 1120, 1680, 1980],
	[630, 1204, 1770, 2100],
	[660, 1260, 1860, 2220],
	[720, 1316, 1950, 2310],
	[750, 1372, 2040, 2430],
]

const EC_BLOCKS = [
	[1, 1, 1, 1],
	[1, 1, 1, 1],
	[1, 1, 2, 2],
	[1, 2, 2, 4],
	[1, 2, 4, 4],
	[2, 4, 4, 4],
	[2, 4, 6, 5],
	[2, 4, 6, 6],
	[2, 5, 8, 8],
	[4, 5, 8, 8],
	[4, 5, 8, 11],
	[4, 8, 10, 11],
	[4, 9, 12, 16],
	[4, 9, 16, 16],
	[6, 10, 12, 18],
	[6, 10, 17, 16],
	[6, 11, 16, 19],
	[6, 13, 18, 21],
	[7, 14, 21, 25],
	[8, 16, 20, 25],
	[8, 17, 23, 25],
	[9, 17, 23, 34],
	[9, 18, 25, 30],
	[10, 20, 27, 32],
	[12, 21, 29, 35],
	[12, 23, 34, 37],
	[12, 25, 34, 40],
	[13, 26, 35, 42],
	[14, 28, 38, 45],
	[15, 29, 40, 48],
	[16, 31, 43, 51],
	[17, 33, 45, 54],
	[18, 35, 48, 57],
	[19, 37, 51, 60],
	[19, 38, 53, 63],
	[20, 40, 56, 66],
	[21, 43, 59, 70],
	[22, 45, 62, 74],
	[24, 47, 65, 77],
	[25, 49, 68, 81],
]

const ALPHANUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

const ECL_BITS: Record<ErrorCorrectionLevel, number> = { L: 1, M: 0, Q: 3, H: 2 }
const ECL_INDEX: Record<ErrorCorrectionLevel, number> = { L: 0, M: 1, Q: 2, H: 3 }

class BitBuffer {
	private readonly bits: number[] = []

	get length(): number {
		return this.bits.length
	}

	append(value: number, count: number): void {
		if (
			!Number.isInteger(value) ||
			value < 0 ||
			count < 0 ||
			count > 31 ||
			value >= 2 ** count
		) {
			throw new RangeError('QR bit value does not fit its field')
		}
		for (let bit = count - 1; bit >= 0; bit--) this.bits.push((value >>> bit) & 1)
	}

	appendBits(values: Uint8Array): void {
		for (const value of values) this.append(value, 8)
	}

	toBytes(): Uint8Array {
		const bytes = new Uint8Array(Math.ceil(this.bits.length / 8))
		for (let i = 0; i < this.bits.length; i++)
			bytes[i >>> 3] |= this.bits[i] << (7 - (i & 7))
		return bytes
	}
}

function utf8Bytes(value: string): Uint8Array {
	const result: number[] = []
	for (let offset = 0; offset < value.length; offset++) {
		let codePoint = value.charCodeAt(offset)
		if (codePoint >= 0xd800 && codePoint <= 0xdbff) {
			const next = value.charCodeAt(offset + 1)
			if (next >= 0xdc00 && next <= 0xdfff) {
				codePoint = 0x10000 + ((codePoint - 0xd800) << 10) + next - 0xdc00
				offset++
			} else {
				codePoint = 0xfffd
			}
		} else if (codePoint >= 0xdc00 && codePoint <= 0xdfff) {
			codePoint = 0xfffd
		}

		if (codePoint <= 0x7f) result.push(codePoint)
		else if (codePoint <= 0x7ff)
			result.push(0xc0 | (codePoint >>> 6), 0x80 | (codePoint & 0x3f))
		else if (codePoint <= 0xffff) {
			result.push(
				0xe0 | (codePoint >>> 12),
				0x80 | ((codePoint >>> 6) & 0x3f),
				0x80 | (codePoint & 0x3f),
			)
		} else {
			result.push(
				0xf0 | (codePoint >>> 18),
				0x80 | ((codePoint >>> 12) & 0x3f),
				0x80 | ((codePoint >>> 6) & 0x3f),
				0x80 | (codePoint & 0x3f),
			)
		}
	}
	return Uint8Array.from(result)
}

function chooseMode(
	data: string,
	bytes: Uint8Array,
): { mode: Mode; bytes: Uint8Array; eci: boolean } {
	if (/^[0-9]*$/.test(data)) return { mode: 'numeric', bytes, eci: false }
	if ([...data].every(character => ALPHANUMERIC.includes(character)))
		return { mode: 'alphanumeric', bytes, eci: false }
	return { mode: 'byte', bytes, eci: [...bytes].some(value => value > 0x7f) }
}

function countBits(mode: Mode, version: number): number {
	if (mode === 'numeric') return version <= 9 ? 10 : version <= 26 ? 12 : 14
	if (mode === 'alphanumeric') return version <= 9 ? 9 : version <= 26 ? 11 : 13
	return version <= 9 ? 8 : 16
}

function payloadBits(mode: Mode, data: string, bytes: Uint8Array): number {
	if (mode === 'numeric')
		return (
			Math.floor(data.length / 3) * 10 +
			(data.length % 3 === 2 ? 7 : data.length % 3 === 1 ? 4 : 0)
		)
	if (mode === 'alphanumeric')
		return Math.floor(data.length / 2) * 11 + (data.length % 2 ? 6 : 0)
	return bytes.length * 8
}

function bitLength(
	mode: Mode,
	data: string,
	bytes: Uint8Array,
	eci: boolean,
	version: number,
): number {
	return (eci ? 12 : 0) + 4 + countBits(mode, version) + payloadBits(mode, data, bytes)
}

function modeIndex(mode: Mode): number {
	return mode === 'numeric' ? 0b0001 : mode === 'alphanumeric' ? 0b0010 : 0b0100
}

function appendPayload(
	buffer: BitBuffer,
	mode: Mode,
	data: string,
	bytes: Uint8Array,
	eci: boolean,
	version: number,
): void {
	if (eci) {
		buffer.append(0b0111, 4)
		buffer.append(26, 8) // ECI assignment number for UTF-8.
	}
	buffer.append(modeIndex(mode), 4)
	buffer.append(mode === 'byte' ? bytes.length : data.length, countBits(mode, version))

	if (mode === 'numeric') {
		let offset = 0
		while (offset + 3 <= data.length) {
			buffer.append(Number(data.slice(offset, offset + 3)), 10)
			offset += 3
		}
		const remaining = data.length - offset
		if (remaining === 2) buffer.append(Number(data.slice(offset)), 7)
		else if (remaining === 1) buffer.append(Number(data[offset]), 4)
	} else if (mode === 'alphanumeric') {
		let offset = 0
		while (offset + 2 <= data.length) {
			buffer.append(
				ALPHANUMERIC.indexOf(data[offset]) * 45 + ALPHANUMERIC.indexOf(data[offset + 1]),
				11,
			)
			offset += 2
		}
		if (offset < data.length) buffer.append(ALPHANUMERIC.indexOf(data[offset]), 6)
	} else {
		buffer.appendBits(bytes)
	}
}

function dataCodewords(
	data: string,
	mode: Mode,
	bytes: Uint8Array,
	eci: boolean,
	version: number,
	level: ErrorCorrectionLevel,
): Uint8Array {
	const totalDataBytes =
		TOTAL_CODEWORDS[version] - EC_CODEWORDS[version - 1][ECL_INDEX[level]]
	const capacity = totalDataBytes * 8
	const buffer = new BitBuffer()
	appendPayload(buffer, mode, data, bytes, eci, version)
	if (buffer.length > capacity)
		throw new RangeError('QR data does not fit in the selected version')
	buffer.append(0, Math.min(4, capacity - buffer.length))
	while (buffer.length % 8 !== 0) buffer.append(0, 1)
	let pad = 0
	while (buffer.length < capacity) buffer.append(pad++ % 2 === 0 ? 0xec : 0x11, 8)
	return buffer.toBytes()
}

const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
let fieldValue = 1
for (let i = 0; i < 255; i++) {
	EXP[i] = fieldValue
	LOG[fieldValue] = i
	fieldValue <<= 1
	if (fieldValue & 0x100) fieldValue ^= 0x11d
}
for (let i = 255; i < EXP.length; i++) EXP[i] = EXP[i - 255]

function gfMultiply(left: number, right: number): number {
	return left === 0 || right === 0 ? 0 : EXP[LOG[left] + LOG[right]]
}

function reedSolomon(data: Uint8Array, ecLength: number): Uint8Array {
	const generator = [1]
	for (let i = 0; i < ecLength; i++) {
		const next = new Array<number>(generator.length + 1).fill(0)
		const root = EXP[i]
		for (let j = 0; j < generator.length; j++) {
			next[j] ^= generator[j]
			next[j + 1] ^= gfMultiply(generator[j], root)
		}
		generator.splice(0, generator.length, ...next)
	}

	const remainder = new Uint8Array(ecLength)
	for (const value of data) {
		const factor = value ^ remainder[0]
		for (let i = 0; i < ecLength - 1; i++) remainder[i] = remainder[i + 1]
		remainder[ecLength - 1] = 0
		for (let i = 0; i < ecLength; i++)
			remainder[i] ^= gfMultiply(generator[i + 1], factor)
	}
	return remainder
}

function interleave(
	data: Uint8Array,
	version: number,
	level: ErrorCorrectionLevel,
): Uint8Array {
	const total = TOTAL_CODEWORDS[version]
	const blockCount = EC_BLOCKS[version - 1][ECL_INDEX[level]]
	const ecTotal = EC_CODEWORDS[version - 1][ECL_INDEX[level]]
	const dataTotal = total - ecTotal
	const baseDataLength = Math.floor(dataTotal / blockCount)
	const shortBlockCount = blockCount - (total % blockCount)
	const ecLength = Math.floor(total / blockCount) - baseDataLength
	const dataBlocks: Uint8Array[] = []
	const ecBlocks: Uint8Array[] = []
	let offset = 0
	for (let block = 0; block < blockCount; block++) {
		const length = block < shortBlockCount ? baseDataLength : baseDataLength + 1
		const blockData = data.slice(offset, offset + length)
		dataBlocks.push(blockData)
		ecBlocks.push(reedSolomon(blockData, ecLength))
		offset += length
	}

	const result = new Uint8Array(total)
	let resultOffset = 0
	const maxDataLength = baseDataLength + 1
	for (let i = 0; i < maxDataLength; i++) {
		for (const block of dataBlocks)
			if (i < block.length) result[resultOffset++] = block[i]
	}
	for (let i = 0; i < ecLength; i++)
		for (const block of ecBlocks) result[resultOffset++] = block[i]
	return result
}

function alignmentCoordinates(version: number, size: number): number[] {
	if (version === 1) return []
	const count = Math.floor(version / 7) + 2
	const interval = size === 145 ? 26 : Math.ceil((size - 13) / (2 * count - 2)) * 2
	const coordinates = [size - 7]
	for (let i = 1; i < count - 1; i++) coordinates[i] = coordinates[i - 1] - interval
	coordinates.push(6)
	return coordinates.reverse()
}

function bchRemainder(value: number, polynomial: number): number {
	let remainder = value
	let valueBits = 0
	let polynomialBits = 0
	for (let v = value; v; v >>>= 1) valueBits++
	for (let v = polynomial; v; v >>>= 1) polynomialBits++
	while (valueBits >= polynomialBits) {
		remainder ^= polynomial << (valueBits - polynomialBits)
		valueBits = 0
		for (let v = remainder; v; v >>>= 1) valueBits++
	}
	return remainder
}

function formatBits(level: ErrorCorrectionLevel, mask: number): number {
	const data = (ECL_BITS[level] << 3) | mask
	return ((data << 10) | bchRemainder(data << 10, 0x537)) ^ 0x5412
}

function versionBits(version: number): number {
	const data = version << 12
	return data | bchRemainder(data, 0x1f25)
}

function index(size: number, row: number, column: number): number {
	return row * size + column
}

function setFunction(
	size: number,
	modules: Uint8Array,
	functionModules: Uint8Array,
	row: number,
	column: number,
	value: number,
): void {
	if (row < 0 || column < 0 || row >= size || column >= size) return
	const at = index(size, row, column)
	modules[at] = value
	functionModules[at] = 1
}

function addFinder(
	size: number,
	modules: Uint8Array,
	functionModules: Uint8Array,
	row: number,
	column: number,
): void {
	for (let r = -1; r <= 7; r++) {
		for (let c = -1; c <= 7; c++) {
			const dark =
				r >= 0 &&
				r <= 6 &&
				c >= 0 &&
				c <= 6 &&
				(r === 0 ||
					r === 6 ||
					c === 0 ||
					c === 6 ||
					(r >= 2 && r <= 4 && c >= 2 && c <= 4))
			setFunction(size, modules, functionModules, row + r, column + c, dark ? 1 : 0)
		}
	}
}

function addFunctionPatterns(
	version: number,
	size: number,
): { modules: Uint8Array; functionModules: Uint8Array } {
	const modules = new Uint8Array(size * size)
	const functionModules = new Uint8Array(size * size)
	addFinder(size, modules, functionModules, 0, 0)
	addFinder(size, modules, functionModules, size - 7, 0)
	addFinder(size, modules, functionModules, 0, size - 7)

	for (let i = 8; i < size - 8; i++) {
		if (!functionModules[index(size, 6, i)])
			setFunction(size, modules, functionModules, 6, i, i % 2 === 0 ? 1 : 0)
		if (!functionModules[index(size, i, 6)])
			setFunction(size, modules, functionModules, i, 6, i % 2 === 0 ? 1 : 0)
	}

	const alignment = alignmentCoordinates(version, size)
	for (let rowIndex = 0; rowIndex < alignment.length; rowIndex++) {
		for (let columnIndex = 0; columnIndex < alignment.length; columnIndex++) {
			// Three corners are occupied by finder patterns. The remaining
			// coordinates can include a timing-line center and intentionally
			// replace that line in their 5x5 footprint.
			if (
				(rowIndex === 0 && columnIndex === 0) ||
				(rowIndex === 0 && columnIndex === alignment.length - 1) ||
				(rowIndex === alignment.length - 1 && columnIndex === 0)
			)
				continue
			const row = alignment[rowIndex]
			const column = alignment[columnIndex]
			for (let r = -2; r <= 2; r++)
				for (let c = -2; c <= 2; c++) {
					const dark = Math.max(Math.abs(r), Math.abs(c)) === 2 || (r === 0 && c === 0)
					setFunction(size, modules, functionModules, row + r, column + c, dark ? 1 : 0)
				}
		}
	}

	// Reserve format information, with mask 0 as the temporary value used while scoring masks.
	setFormat(size, modules, functionModules, formatBits('L', 0))
	if (version >= 7) {
		const bits = versionBits(version)
		for (let i = 0; i < 18; i++) {
			const row = Math.floor(i / 3)
			const column = (i % 3) + size - 11
			const value = (bits >>> i) & 1
			setFunction(size, modules, functionModules, row, column, value)
			setFunction(size, modules, functionModules, column, row, value)
		}
	}
	return { modules, functionModules }
}

function setFormat(
	size: number,
	modules: Uint8Array,
	functionModules: Uint8Array,
	bits: number,
): void {
	for (let i = 0; i < 15; i++) {
		const value = (bits >>> i) & 1
		if (i < 6) setFunction(size, modules, functionModules, i, 8, value)
		else if (i < 8) setFunction(size, modules, functionModules, i + 1, 8, value)
		else setFunction(size, modules, functionModules, size - 15 + i, 8, value)

		if (i < 8) setFunction(size, modules, functionModules, 8, size - i - 1, value)
		else if (i === 8) setFunction(size, modules, functionModules, 8, 7, value)
		else setFunction(size, modules, functionModules, 8, 15 - i - 1, value)
	}
	setFunction(size, modules, functionModules, size - 8, 8, 1)
}

function writeData(
	size: number,
	modules: Uint8Array,
	functionModules: Uint8Array,
	codewords: Uint8Array,
): void {
	let row = size - 1
	let direction = -1
	let byte = 0
	let bit = 7
	for (let column = size - 1; column > 0; column -= 2) {
		if (column === 6) column--
		let traversing = true
		while (traversing) {
			for (let offset = 0; offset < 2; offset++) {
				const currentColumn = column - offset
				const at = index(size, row, currentColumn)
				if (functionModules[at]) continue
				modules[at] = byte < codewords.length ? (codewords[byte] >>> bit) & 1 : 0
				bit--
				if (bit < 0) {
					byte++
					bit = 7
				}
			}
			row += direction
			if (row < 0 || row >= size) {
				row -= direction
				direction = -direction
				traversing = false
			}
		}
	}
}

function maskApplies(mask: number, row: number, column: number): boolean {
	switch (mask) {
		case 0:
			return (row + column) % 2 === 0
		case 1:
			return row % 2 === 0
		case 2:
			return column % 3 === 0
		case 3:
			return (row + column) % 3 === 0
		case 4:
			return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0
		case 5:
			return ((row * column) % 2) + ((row * column) % 3) === 0
		case 6:
			return (((row * column) % 2) + ((row * column) % 3)) % 2 === 0
		case 7:
			return (((row * column) % 3) + ((row + column) % 2)) % 2 === 0
		default:
			return false
	}
}

function applyMask(
	size: number,
	modules: Uint8Array,
	functionModules: Uint8Array,
	mask: number,
): void {
	for (let row = 0; row < size; row++)
		for (let column = 0; column < size; column++) {
			const at = index(size, row, column)
			if (!functionModules[at] && maskApplies(mask, row, column)) modules[at] ^= 1
		}
}

function penalty(modules: Uint8Array, size: number): number {
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
	const balance = Math.abs(Math.ceil((dark * 100) / modules.length / 5) - 10)
	return score + balance * 10
}

function buildMatrix(
	version: number,
	level: ErrorCorrectionLevel,
	codewords: Uint8Array,
): { modules: Uint8Array; functionModules: Uint8Array; mask: number } {
	const size = version * 4 + 17
	const base = addFunctionPatterns(version, size)
	let bestModules: Uint8Array | undefined
	let bestMask = 0
	let bestPenalty = Number.POSITIVE_INFINITY
	for (let mask = 0; mask < 8; mask++) {
		const candidate = base.modules.slice()
		writeData(size, candidate, base.functionModules, codewords)
		applyMask(size, candidate, base.functionModules, mask)
		setFormat(size, candidate, base.functionModules, formatBits(level, mask))
		const candidatePenalty = penalty(candidate, size)
		if (candidatePenalty < bestPenalty) {
			bestPenalty = candidatePenalty
			bestMask = mask
			bestModules = candidate
		}
	}
	return {
		modules: bestModules as Uint8Array,
		functionModules: base.functionModules,
		mask: bestMask,
	}
}

export function encodeQR(data: string, options: EncodeOptions = {}): QRMatrix {
	if (typeof data !== 'string') throw new RangeError('QR data must be a string')
	if (data.length === 0) throw new RangeError('QR data must not be empty')
	for (let offset = 0; offset < data.length; offset++) {
		const codeUnit = data.charCodeAt(offset)
		if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
			const next = data.charCodeAt(offset + 1)
			if (next >= 0xdc00 && next <= 0xdfff) {
				offset++
				continue
			}
			throw new RangeError('QR data contains an unpaired UTF-16 surrogate')
		}
		if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff)
			throw new RangeError('QR data contains an unpaired UTF-16 surrogate')
	}
	if (options === null || typeof options !== 'object')
		throw new RangeError('QR options must be an object')
	const level = options.errorCorrectionLevel ?? 'M'
	if (level !== 'L' && level !== 'M' && level !== 'Q' && level !== 'H')
		throw new RangeError('QR error correction level must be L, M, Q, or H')
	const minVersion = options.minVersion ?? 1
	const maxVersion = options.maxVersion ?? 40
	if (!Number.isInteger(minVersion) || minVersion < 1 || minVersion > 40)
		throw new RangeError('QR minVersion must be an integer from 1 to 40')
	if (!Number.isInteger(maxVersion) || maxVersion < 1 || maxVersion > 40)
		throw new RangeError('QR maxVersion must be an integer from 1 to 40')
	if (minVersion > maxVersion)
		throw new RangeError('QR minVersion cannot exceed maxVersion')

	const bytes = utf8Bytes(data)
	const chosen = chooseMode(data, bytes)
	let version = 0
	for (let candidate = minVersion; candidate <= maxVersion; candidate++) {
		const capacity =
			(TOTAL_CODEWORDS[candidate] - EC_CODEWORDS[candidate - 1][ECL_INDEX[level]]) * 8
		if (bitLength(chosen.mode, data, bytes, chosen.eci, candidate) <= capacity) {
			version = candidate
			break
		}
	}
	if (version === 0)
		throw new RangeError('QR data does not fit within the requested version range')

	const codewords = interleave(
		dataCodewords(data, chosen.mode, bytes, chosen.eci, version, level),
		version,
		level,
	)
	const matrix = buildMatrix(version, level, codewords)
	return {
		size: version * 4 + 17,
		modules: matrix.modules,
		functionModules: matrix.functionModules,
		version,
		errorCorrectionLevel: level,
		mask: matrix.mask,
	}
}
