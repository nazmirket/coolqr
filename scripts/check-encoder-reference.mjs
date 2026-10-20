import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createHash } from 'node:crypto'
import ts from 'typescript'
// This optional check runs after build; dist is absent during clean-checkout lint.
const { encodeQR } = await import(new URL('../dist/index.js', import.meta.url).href)

// External reference stays outside the production package and dependency graph.
// See docs/verification.md for the reviewed source and its provenance.
const referencePath = process.env.COOLQR_ENCODER_REFERENCE
if (!referencePath)
	throw new Error('Set COOLQR_ENCODER_REFERENCE to the reviewed qrcodegen.ts')
const source = fs.readFileSync(referencePath, 'utf8')
assert.equal(
	createHash('sha256').update(source).digest('hex'),
	'1dc03fb5a10e0e2318ea162755bbdb9977ca6ce52cff959e9c9b6deafdccda9c',
)
const compiled = ts.transpileModule(source, {
	compilerOptions: { target: ts.ScriptTarget.ES2020 },
}).outputText
const sandbox = {}
vm.runInNewContext(compiled + ';globalThis.reference = qrcodegen', sandbox)
const { QrCode, QrSegment } = sandbox.reference
const levels = {
	L: QrCode.Ecc.LOW,
	M: QrCode.Ecc.MEDIUM,
	Q: QrCode.Ecc.QUARTILE,
	H: QrCode.Ecc.HIGH,
}
let comparisons = 0
for (const data of ['A', '1234', 'hello', '漢']) {
	for (let version = 1; version <= 40; version++) {
		for (const [level, referenceLevel] of Object.entries(levels)) {
			const actual = encodeQR(data, {
				minVersion: version,
				maxVersion: version,
				errorCorrectionLevel: level,
			})
			const segments =
				data === '漢'
					? [
							QrSegment.makeEci(26),
							QrSegment.makeBytes(Array.from(new TextEncoder().encode(data))),
						]
					: QrSegment.makeSegments(data)
			const expected = QrCode.encodeSegments(
				segments,
				referenceLevel,
				version,
				version,
				actual.mask,
				false,
			)
			for (let row = 0; row < actual.size; row++)
				for (let column = 0; column < actual.size; column++)
					assert.equal(
						Boolean(actual.modules[row * actual.size + column]),
						expected.getModule(column, row),
						`${data}, version ${version}-${level}, ${row},${column}`,
					)
			comparisons++
		}
	}
}
process.stdout.write(`${comparisons} matrices match the independent encoder\n`)
