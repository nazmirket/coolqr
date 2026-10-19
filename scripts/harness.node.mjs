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
			} finally {
				rmSync(fixture, { recursive: true, force: true })
			}
		})
	}
}

test('the installed harness matches the reviewed CI release', () => {
	const version = read('.github/workflows/harness.yml').match(/MIRKET_RELEASE: mirket-v(\d+\.\d+\.\d+)/)?.[1]
	assert.ok(version, 'the published release pin is required')
	const runtime = spawnSync('mirket', ['--version'], { encoding: 'utf8' })
	assert.equal(runtime.status, 0, runtime.stderr)
	assert.equal(runtime.stdout.trim(), `mirket ${version}`, 'Run mirket update and synchronize the project before continuing')
})
