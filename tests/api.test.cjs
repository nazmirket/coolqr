const assert = require('node:assert/strict')
const test = require('node:test')

test('the package entry point works in Node without browser globals', async () => {
	const { encodeQR, renderQR } = require('../dist/index.js')
	const qr = encodeQR('https://example.com')
	assert.equal(qr.size, 21 + 4 * (qr.version - 1))
	assert.equal(qr.modules.length, qr.size * qr.size)
	assert.equal(qr.functionModules.length, qr.size * qr.size)
	await assert.rejects(renderQR('https://example.com'), /requires a browser/)
})
