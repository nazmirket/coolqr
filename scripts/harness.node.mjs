import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
	appendFileSync,
	cpSync,
	mkdtempSync,
	mkdirSync,
	readFileSync,
	rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { verifyIdentity } from './harness-identity.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = path => readFileSync(join(root, path), 'utf8')

test('both hosts share canonical instructions and a minimal selection', () => {
	assert.equal(read('CLAUDE.md').trim(), '@AGENTS.md')
	const manifest = JSON.parse(read('.mirket/project.json'))
	assert.deepEqual([...manifest.targets].sort(), ['claude', 'codex'])
	assert.deepEqual(manifest.profiles, ['project-foundation'])
	assert.equal(manifest.target_skills, undefined)
	assert.equal(new Set(manifest.skills).size, manifest.skills.length)
	for (const skill of [
		'architecture-review',
		'debugging',
		'test-design',
		'release-operations',
	]) {
		assert.ok(
			!manifest.skills.includes(skill),
			`${skill} is already selected by project-foundation`,
		)
	}
	const tracked = spawnSync('git', ['ls-files', '.mirket/project.lock'], {
		cwd: root,
		encoding: 'utf8',
	})
	assert.equal(tracked.status, 0, tracked.stderr)
	assert.equal(tracked.stdout, '', 'the synchronization mutex must not be committed')
})

for (const target of ['.agents', '.claude']) {
	for (const failure of ['modified', 'missing']) {
		test(`${target}: the real doctor rejects ${failure} managed guidance`, () => {
			const fixture = mkdtempSync(join(tmpdir(), 'mirket-adoption-'))
			try {
				mkdirSync(join(fixture, '.mirket'))
				cpSync(join(root, '.mirket/project.json'), join(fixture, '.mirket/project.json'))
				for (const host of ['.agents', '.claude']) {
					cpSync(join(root, host, 'skills'), join(fixture, host, 'skills'), {
						recursive: true,
					})
				}
				const doctor = () =>
					spawnSync('mirket', ['project', 'doctor', '--project', fixture, '--json'], {
						encoding: 'utf8',
					})
				const valid = doctor()
				assert.equal(valid.status, 0, valid.stderr || valid.stdout)
				assert.equal(JSON.parse(valid.stdout).ok, true)
				const path = join(fixture, target, 'skills/debugging/SKILL.md')
				if (failure === 'modified') appendFileSync(path, '\nUnapproved fixture change.\n')
				else rmSync(path)
				const broken = doctor()
				assert.equal(broken.status, 1, broken.stderr || broken.stdout)
				assert.equal(JSON.parse(broken.stdout).ok, false)
				assert.match(broken.stdout, /conflict|missing|changed|modified|digest/i)
				cpSync(join(root, target, 'skills/debugging/SKILL.md'), path)
				const restored = doctor()
				assert.equal(restored.status, 0, restored.stderr || restored.stdout)
				assert.equal(JSON.parse(restored.stdout).ok, true)
			} finally {
				rmSync(fixture, { recursive: true, force: true })
			}
		})
	}
}

const release = JSON.parse(read('.mirket/release.json'))
const info = spawnSync('mirket', ['info', '--json'], { encoding: 'utf8' })
assert.equal(info.status, 0, info.stderr)
const runtime = JSON.parse(info.stdout)

test('the executable, source and catalog match the reviewed public release', () => {
	verifyIdentity(runtime, release)
})

for (const field of ['executable_sha256', 'source_sha256', 'target']) {
	test(`same-version runtime with altered ${field} is rejected`, () => {
		const altered = structuredClone(runtime)
		altered.process[field] = 'unreviewed'
		assert.throws(() => verifyIdentity(altered, release))
	})
}

test('same-version altered catalog and stale live process are rejected', () => {
	const altered = structuredClone(runtime)
	altered.catalog.sha256 = 'unreviewed'
	assert.throws(() => verifyIdentity(altered, release))
	const stale = structuredClone(runtime)
	stale.installed_binary = { matches_process: false, sha256: 'stale' }
	assert.throws(() => verifyIdentity(stale, release))
})

test('standalone CI binary is verified without a desktop home installation', () => {
	const home = mkdtempSync(join(tmpdir(), 'mirket-standalone-'))
	try {
		const result = spawnSync('mirket', ['info', '--home', home, '--json'], {
			encoding: 'utf8',
		})
		assert.equal(result.status, 0, result.stderr)
		const standalone = JSON.parse(result.stdout)
		assert.equal(standalone.installed_binary.sha256, null)
		verifyIdentity(standalone, release)
		standalone.process.executable_sha256 = 'unreviewed'
		assert.throws(() => verifyIdentity(standalone, release))
	} finally {
		rmSync(home, { recursive: true, force: true })
	}
})
