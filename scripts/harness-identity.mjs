import assert from 'node:assert/strict'

/** Compare content identity, not just the executable's version label. */
export function verifyIdentity(runtime, release) {
	assert.equal(runtime.process.version, release.version, 'harness version differs')
	const asset = release.assets.find(asset => asset.target === runtime.process.target)
	assert.ok(asset, `Unreviewed harness target: ${runtime.process.target}`)
	assert.equal(runtime.process.executable_sha256, asset.sha256, 'harness binary differs')
	assert.equal(
		runtime.process.source_sha256,
		release.source_sha256,
		'compiled source differs',
	)
	assert.equal(runtime.catalog.sha256, release.catalog_sha256, 'embedded catalog differs')
	// Standalone CI executables have no home installation. When present, check it too.
	if (runtime.installed_binary?.sha256 !== null && runtime.installed_binary) {
		assert.equal(
			runtime.installed_binary.matches_process,
			true,
			'installed/runtime drift',
		)
		assert.equal(
			runtime.installed_binary.sha256,
			asset.sha256,
			'installed binary differs',
		)
	}
}
