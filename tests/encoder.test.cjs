const assert = require('node:assert/strict')
const test = require('node:test')

const { encodeQR } = require('../dist/encoder/index.js')

const HELLO_WORLD = [
	'111111100010101111111',
	'100000101010101000001',
	'101110101011001011101',
	'101110100000101011101',
	'101110101111101011101',
	'100000101110001000001',
	'111111101010101111111',
	'000000001000000000000',
	'110100110011101110110',
	'111011001011000010001',
	'101000100101011001010',
	'101111011100111100111',
	'000111110111001110101',
	'000000001000011010111',
	'111111101001101100101',
	'100000100010001101000',
	'101110100110111101101',
	'101110101010011101011',
	'101110100011011101001',
	'100000101011100011001',
	'111111101010010101000',
]

test('matches the standard Version 1-L HELLO WORLD fixture', () => {
	const qr = encodeQR('HELLO WORLD', { errorCorrectionLevel: 'L' })

	assert.equal(qr.version, 1)
	assert.equal(qr.size, 21)
	assert.equal(qr.mask, 7)
	assert.deepEqual(
		Array.from({ length: qr.size }, (_, row) =>
			Array.from(qr.modules.slice(row * qr.size, (row + 1) * qr.size)).join(''),
		),
		HELLO_WORLD,
	)
})

test('supports every version and error correction level', () => {
	for (let version = 1; version <= 40; version++) {
		for (const errorCorrectionLevel of ['L', 'M', 'Q', 'H']) {
			const qr = encodeQR('A', {
				errorCorrectionLevel,
				minVersion: version,
				maxVersion: version,
			})
			assert.equal(qr.size, version * 4 + 17)
			assert.equal(qr.modules.length, qr.size * qr.size)
			assert.equal(qr.functionModules.length, qr.size * qr.size)
			assert.ok(qr.mask >= 0 && qr.mask <= 7)
			for (const value of qr.modules) assert.ok(value === 0 || value === 1)
			for (const value of qr.functionModules) assert.ok(value === 0 || value === 1)
		}
	}
})

test('encodes numeric, alphanumeric, and UTF-8 payloads deterministically', () => {
	const numeric = encodeQR('01234567890123456789', { errorCorrectionLevel: 'Q' })
	const alphanumeric = encodeQR('HELLO-QR 2026', { errorCorrectionLevel: 'Q' })
	const unicode = encodeQR('こんにちは QR', { errorCorrectionLevel: 'Q' })

	assert.equal(numeric.version, 1)
	assert.equal(alphanumeric.version, 1)
	assert.ok(unicode.version >= 2)
	assert.deepEqual(encodeQR('こんにちは QR', { errorCorrectionLevel: 'Q' }), unicode)
	assert.notDeepEqual(numeric.modules, alphanumeric.modules)
})

test('keeps function modules stable while changing data', () => {
	const first = encodeQR('first', {
		errorCorrectionLevel: 'M',
		minVersion: 7,
		maxVersion: 7,
	})
	const second = encodeQR('second', {
		errorCorrectionLevel: 'M',
		minVersion: 7,
		maxVersion: 7,
	})

	assert.deepEqual(first.functionModules, second.functionModules)
	assert.notDeepEqual(first.modules, second.modules)
})

test('rejects invalid options and payload overflow with RangeError', () => {
	assert.throws(() => encodeQR(42), {
		name: 'RangeError',
		message: /data must be a string/,
	})
	assert.throws(() => encodeQR(''), {
		name: 'RangeError',
		message: /must not be empty/,
	})
	assert.throws(() => encodeQR('\ud800'), {
		name: 'RangeError',
		message: /unpaired UTF-16 surrogate/,
	})
	assert.throws(() => encodeQR('data', { errorCorrectionLevel: 'X' }), {
		name: 'RangeError',
		message: /error correction level/,
	})
	assert.throws(() => encodeQR('data', { minVersion: 0 }), {
		name: 'RangeError',
		message: /minVersion/,
	})
	assert.throws(() => encodeQR('data', { minVersion: 4, maxVersion: 3 }), {
		name: 'RangeError',
		message: /cannot exceed/,
	})
	assert.throws(() => encodeQR('x'.repeat(5000), { errorCorrectionLevel: 'H' }), {
		name: 'RangeError',
		message: /does not fit/,
	})
})
