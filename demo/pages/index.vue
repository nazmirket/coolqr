<template>
	<main class="app-shell">
		<div class="ambient ambient-primary" aria-hidden="true"></div>
		<div class="ambient ambient-secondary" aria-hidden="true"></div>

		<section class="workspace">
			<header class="topbar">
				<a class="brand" href="/" aria-label="CoolQR home">
					<span class="brand-mark" aria-hidden="true">qr</span>
					<span class="brand-name">CoolQR</span>
				</a>
				<nav class="project-links" aria-label="Project links">
					<a href="https://github.com/nazmirket/coolqr" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
					<a href="https://www.npmjs.com/package/coolqr" target="_blank" rel="noreferrer">NPM <span aria-hidden="true">↗</span></a>
				</nav>
			</header>

			<div class="intro">
				<div class="eyebrow">
					<span class="eyebrow-dot" aria-hidden="true"></span>
					<span>Browser-side generator</span>
					<span class="eyebrow-divider" aria-hidden="true"></span>
					<span>Instant preview · no uploads</span>
				</div>
				<h1>Make a QR code that feels <em>like yours.</em></h1>
				<p>Shape the details, preview the result, and export a code that is ready to share.</p>
			</div>

			<div class="builder-grid">
				<section class="controls-card" aria-labelledby="controls-title">
					<div class="card-heading">
						<div>
							<p class="section-kicker">01 / Content</p>
							<h2 id="controls-title">What should it open?</h2>
						</div>
						<span class="character-count" aria-live="polite">{{ data.length }}/2000</span>
					</div>

					<label class="field-label" for="qr-content">
						<span>URL or message</span>
						<span class="field-hint">Link, text, contact info, or anything else</span>
					</label>
					<div class="input-wrap">
						<span class="input-prefix" aria-hidden="true">↗</span>
						<input
							id="qr-content"
							v-model="data"
							maxlength="2000"
							type="text"
							placeholder="https://example.com"
							aria-label="QR code content"
						/>
					</div>
					<p class="helper-text">Your content stays in this browser while you design.</p>

					<div class="mobile-preview" aria-label="Generated QR preview">
						<div v-if="preview" class="mobile-qr-paper">
							<img class="qr-image" :src="preview" alt="Generated CoolQR preview" />
						</div>
						<div v-else-if="renderError" class="mobile-preview-error" role="alert">{{ renderError }}</div>
						<div v-else class="mobile-preview-loading" aria-live="polite">Drawing your preview…</div>
					</div>

					<div class="appearance-heading">
						<div>
							<p class="section-kicker">02 / Appearance</p>
							<h2>Make it unmistakably yours</h2>
						</div>
						<span class="appearance-note">3 details</span>
					</div>

					<fieldset class="option-group">
						<legend><span>01</span> Outer eyes <small>Corner frames</small></legend>
						<div class="option-row">
							<label class="color-control">
								<span>Color</span>
								<input v-model="options.eyes.outer.fill.color" type="color" aria-label="Outer eye color" />
							</label>
							<div class="shape-control">
								<span class="control-label">Shape</span>
								<div class="shape-grid" role="group" aria-label="Outer eye shape">
									<button
										v-for="shape in outerFrames"
										:key="shape"
										type="button"
										class="shape-button"
										:class="{ 'is-selected': options.eyes.outer.shape === shape }"
										:aria-label="`Outer eye ${shape}`"
										:aria-pressed="options.eyes.outer.shape === shape"
										title="shape"
										@click="options.eyes.outer.shape = shape"
									>
										<img :src="`/frames/${shape}.svg`" :alt="shape" />
									</button>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset class="option-group">
						<legend><span>02</span> Inner eyes <small>Center markers</small></legend>
						<div class="option-row">
							<label class="color-control">
								<span>Color</span>
								<input v-model="options.eyes.inner.fill.color" type="color" aria-label="Inner eye color" />
							</label>
							<div class="shape-control">
								<span class="control-label">Shape</span>
								<div class="shape-grid" role="group" aria-label="Inner eye shape">
									<button
										v-for="shape in shapes"
										:key="shape"
										type="button"
										class="shape-button"
										:class="{ 'is-selected': options.eyes.inner.shape === shape }"
										:aria-label="`Inner eye ${shape}`"
										:aria-pressed="options.eyes.inner.shape === shape"
										title="shape"
										@click="options.eyes.inner.shape = shape"
									>
										<img :src="`/${shape}.svg`" :alt="shape" />
									</button>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset class="option-group">
						<legend><span>03</span> Dots <small>The signal itself</small></legend>
						<div class="option-row">
							<label class="color-control">
								<span>Color</span>
								<input v-model="options.dots.fill.color" type="color" aria-label="Dot color" />
							</label>
							<div class="shape-control">
								<span class="control-label">Shape</span>
								<div class="shape-grid" role="group" aria-label="Dot shape">
									<button
										v-for="shape in shapes"
										:key="shape"
										type="button"
										class="shape-button"
										:class="{ 'is-selected': options.dots.shape === shape }"
										:aria-label="`Dot ${shape}`"
										:aria-pressed="options.dots.shape === shape"
										title="shape"
										@click="options.dots.shape = shape"
									>
										<img :src="`/${shape}.svg`" :alt="shape" />
									</button>
								</div>
							</div>
						</div>
					</fieldset>

					<div class="actions">
						<button type="button" class="button button-secondary" @click="copyOptions">
							<span class="button-icon" aria-hidden="true">⌘</span>
							{{ copied ? 'Copied!' : 'Copy options' }}
						</button>
						<button type="button" class="button button-primary" :disabled="!preview" @click="download">
							Download PNG <span class="button-arrow" aria-hidden="true">↗</span>
						</button>
					</div>
					<p v-if="copyError" class="feedback feedback-error" role="alert">{{ copyError }}</p>
					<p class="privacy-note"><span aria-hidden="true">✦</span> Everything renders locally in your browser.</p>
				</section>

				<aside class="preview-card" aria-labelledby="preview-title">
					<div class="preview-heading">
						<div>
							<p class="section-kicker">03 / Preview</p>
							<h2 id="preview-title">Your code, ready to share</h2>
						</div>
						<span class="status-pill" :class="{ 'is-ready': preview }">
							<span class="status-dot" aria-hidden="true"></span>{{ preview ? 'Ready' : 'Rendering' }}
						</span>
					</div>

					<div class="preview-stage" :class="{ 'is-error': renderError }">
						<div ref="previewContainer" class="sr-only" aria-hidden="true"></div>
						<div v-if="preview" class="qr-paper">
							<img class="qr-image" :src="preview" alt="Generated CoolQR preview" />
						</div>
						<div v-else-if="renderError" class="preview-message" role="alert">
							<span class="message-icon" aria-hidden="true">!</span>
							<strong>Couldn’t generate this code</strong>
							<p>{{ renderError }}</p>
						</div>
						<div v-else class="preview-message preview-loading" aria-live="polite">
							<span class="loading-orbit" aria-hidden="true"></span>
							<strong>Drawing your preview…</strong>
							<p>A fresh code appears here in a moment.</p>
						</div>
					</div>

					<div class="preview-meta" aria-label="Preview details">
						<div><span>Format</span><strong>PNG</strong></div>
						<div><span>Canvas</span><strong>512 × 512</strong></div>
						<div><span>Privacy</span><strong>On-device</strong></div>
					</div>

					<div class="preview-tip">
						<span class="tip-icon" aria-hidden="true">✦</span>
						<p>Keep generous space around your code when placing it in print or on screen for the best scan.</p>
					</div>
				</aside>
			</div>

			<footer class="footer-note">
				<span>CoolQR</span>
				<span class="footer-divider" aria-hidden="true"></span>
				<span>Open-source QR styling for the web</span>
			</footer>
		</section>
	</main>
</template>

<script setup lang="ts">
import CoolQR, { type Frame, type QROptions, type Shape } from 'coolqr'

const data = ref('https://example.com')
const preview = ref('')
const renderError = ref('')
const copied = ref(false)
const copyError = ref('')
const previewContainer = ref<HTMLDivElement | null>(null)
const renderedStage = ref<Awaited<ReturnType<typeof CoolQR.draw>>>()

const outerFrames: Frame[] = ['square', 'circle', 'rounded', 'rounded2', 'rounded3', 'rounded4', 'rounded5', 'rounded6', 'squarecircle']
const shapes: Shape[] = ['square', 'circle', 'diamond', 'rounded', 'rounded2', 'rounded3', 'rounded4', 'sun', 'cross', 'hexagon', 'octagon']

const options = ref<QROptions>({
	size: 512,
	background: { fill: { type: 'solid', color: '#ffffff' } },
	eyes: {
		outer: { shape: 'rounded', fill: { type: 'solid', color: '#a90000' } },
		inner: { shape: 'diamond', fill: { type: 'solid', color: '#a90000' } },
	},
	dots: { shape: 'circle', fill: { type: 'solid', color: '#000000' } },
})

let renderSequence = 0

async function render() {
	const sequence = ++renderSequence
	renderedStage.value?.destroy()
	renderedStage.value = undefined
	preview.value = ''
	renderError.value = ''
	await nextTick()
	if (!previewContainer.value) return

	let stage: Awaited<ReturnType<typeof CoolQR.draw>>
	try {
		stage = await CoolQR.draw(data.value, previewContainer.value, options.value)
	} catch (error) {
		if (sequence === renderSequence) renderError.value = error instanceof Error ? error.message : 'Unable to generate a QR code.'
		return
	}
	if (sequence !== renderSequence) {
		stage.destroy()
		return
	}

	renderedStage.value = stage
	preview.value = previewContainer.value.querySelector('canvas')?.toDataURL() ?? ''
}

onMounted(() => void render())
watch([data, options], () => void render(), { deep: true })
onBeforeUnmount(() => {
	renderSequence++
	renderedStage.value?.destroy()
	renderedStage.value = undefined
})

async function copyOptions() {
	try {
		await navigator.clipboard.writeText(JSON.stringify(options.value))
		copyError.value = ''
		copied.value = true
		setTimeout(() => { copied.value = false }, 1400)
	} catch {
		copied.value = false
		copyError.value = 'Clipboard access is unavailable. Check browser permissions and try again.'
	}
}

function download() {
	const canvas = previewContainer.value?.querySelector('canvas')
	if (!canvas) return
	const link = document.createElement('a')
	link.download = 'coolqr.png'
	link.href = canvas.toDataURL('image/png')
	link.click()
}
</script>

<style>
:root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-synthesis: none; }
* { box-sizing: border-box; }
body { margin: 0; background: #f4f5f9; color: #121525; }
button, input { font: inherit; }
button { cursor: pointer; }
.app-shell { position: relative; min-height: 100vh; overflow: hidden; background: #f4f5f9; padding: 32px; }
.ambient { position: absolute; pointer-events: none; border-radius: 999px; filter: blur(2px); }
.ambient-primary { width: 540px; height: 540px; top: -240px; right: -160px; background: #dcd9ff; opacity: .72; }
.ambient-secondary { width: 330px; height: 330px; bottom: -150px; left: -110px; background: #e7f5e7; opacity: .85; }
.workspace { position: relative; z-index: 1; max-width: 1240px; margin: 0 auto; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 4px 0; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: #121525; text-decoration: none; }
.brand-mark { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: #121525; color: #d8ff65; font-size: 15px; font-weight: 900; letter-spacing: -.08em; }
.brand-name { font-size: 17px; font-weight: 800; letter-spacing: -.04em; }
.project-links { display: flex; gap: 22px; }
.project-links a { color: #686d7b; font-size: 13px; font-weight: 700; text-decoration: none; transition: color .18s ease; }
.project-links a:hover, .project-links a:focus-visible { color: #5b50db; }
.project-links span { margin-left: 3px; font-size: 14px; }
.intro { max-width: 790px; padding: 88px 4px 46px; }
.eyebrow { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; color: #686d7b; font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.eyebrow-dot, .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #72a838; box-shadow: 0 0 0 4px #e7f3dc; }
.eyebrow-divider { width: 1px; height: 13px; margin: 0 3px; background: #d2d5dc; }
.intro h1 { max-width: 740px; margin: 20px 0 15px; color: #121525; font-size: clamp(3.15rem, 7vw, 6.4rem); font-weight: 850; letter-spacing: -.085em; line-height: .92; }
.intro h1 em { color: #5b50db; font-style: normal; }
.intro p { max-width: 510px; margin: 0; color: #686d7b; font-size: 17px; line-height: 1.55; }
.builder-grid { display: grid; grid-template-columns: minmax(0, .91fr) minmax(390px, 1.09fr); align-items: start; gap: 24px; }
.controls-card, .preview-card { border: 1px solid rgba(18, 21, 37, .07); border-radius: 26px; box-shadow: 0 22px 55px rgba(34, 39, 70, .08); }
.controls-card { padding: 30px; background: #ffffff; }
.preview-card { position: sticky; top: 24px; padding: 30px; background: #121525; color: #ffffff; }
.card-heading, .preview-heading, .appearance-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.section-kicker { margin: 0 0 7px; color: #868b99; font-size: 10px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
.preview-card .section-kicker { color: #9da1b1; }
.card-heading h2, .appearance-heading h2, .preview-heading h2 { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -.04em; line-height: 1.1; }
.character-count, .appearance-note { color: #999eac; font-size: 11px; font-weight: 700; white-space: nowrap; }
.field-label { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-top: 27px; margin-bottom: 10px; color: #34384a; font-size: 12px; font-weight: 800; }
.field-hint { color: #9a9eaa; font-size: 11px; font-weight: 500; }
.input-wrap { display: flex; align-items: center; gap: 10px; min-height: 58px; border: 1px solid #e3e5eb; border-radius: 14px; padding: 0 16px; background: #fafbfc; transition: border-color .18s ease, box-shadow .18s ease, background .18s ease; }
.input-wrap:focus-within { border-color: #8277ee; background: #ffffff; box-shadow: 0 0 0 4px #ebe9ff; }
.input-prefix { color: #5b50db; font-size: 22px; font-weight: 500; line-height: 1; }
.input-wrap input { width: 100%; border: 0; outline: 0; background: transparent; color: #121525; font-size: 16px; font-weight: 600; letter-spacing: -.02em; }
.input-wrap input::placeholder { color: #a5a9b4; }
.helper-text { margin: 9px 0 0; color: #9a9eaa; font-size: 11px; }
.appearance-heading { margin-top: 34px; padding-top: 27px; border-top: 1px solid #eceef2; }
.option-group { min-width: 0; margin: 21px 0 0; border: 1px solid #e7e9ef; border-radius: 17px; padding: 17px; }
.option-group legend { width: 100%; padding: 0; color: #313649; font-size: 12px; font-weight: 800; }
.option-group legend span { display: inline-grid; place-items: center; width: 21px; height: 21px; margin-right: 7px; border-radius: 7px; background: #f0efff; color: #5b50db; font-size: 10px; }
.option-group legend small { margin-left: 5px; color: #a2a5b0; font-size: 10px; font-weight: 500; }
.option-row { display: grid; grid-template-columns: 68px minmax(0, 1fr); gap: 18px; align-items: start; margin-top: 16px; }
.color-control, .shape-control { display: flex; flex-direction: column; gap: 8px; }
.color-control span, .control-label { color: #8a8f9e; font-size: 10px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
.color-control input { width: 46px; height: 34px; padding: 2px; border: 1px solid #e1e3e9; border-radius: 9px; background: #ffffff; cursor: pointer; }
.color-control input:focus-visible { outline: 3px solid #c7c2ff; outline-offset: 2px; }
.shape-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.shape-button { display: grid; place-items: center; width: 39px; height: 39px; border: 1px solid #e6e8ee; border-radius: 10px; padding: 5px; background: #ffffff; transition: border-color .15s ease, background .15s ease, transform .15s ease, box-shadow .15s ease; }
.shape-button:hover { border-color: #b8b2fb; background: #f9f8ff; transform: translateY(-1px); }
.shape-button:focus-visible { outline: 3px solid #c7c2ff; outline-offset: 2px; }
.shape-button.is-selected { border-color: #5b50db; background: #f0efff; box-shadow: inset 0 0 0 1px #5b50db; }
.shape-button img { width: 27px; height: 27px; object-fit: contain; }
.actions { display: grid; grid-template-columns: .82fr 1.18fr; gap: 10px; margin-top: 25px; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 52px; border: 0; border-radius: 13px; font-size: 13px; font-weight: 800; transition: transform .18s ease, box-shadow .18s ease, background .18s ease; }
.button:focus-visible { outline: 3px solid #c7c2ff; outline-offset: 3px; }
.button:not(:disabled):hover { transform: translateY(-2px); }
.button:disabled { cursor: not-allowed; opacity: .48; }
.button-secondary { border: 1px solid #e1e3e9; background: #ffffff; color: #565b6b; }
.button-secondary:not(:disabled):hover { border-color: #b8b2fb; background: #faf9ff; }
.button-primary { background: #5b50db; color: #ffffff; box-shadow: 0 9px 18px rgba(91, 80, 219, .22); }
.button-primary:not(:disabled):hover { background: #4a40c5; box-shadow: 0 12px 22px rgba(91, 80, 219, .3); }
.button-icon { color: #5b50db; font-size: 17px; }
.button-arrow { font-size: 18px; font-weight: 500; }
.privacy-note { display: flex; align-items: center; justify-content: center; gap: 7px; margin: 16px 0 0; color: #9a9eaa; font-size: 10px; }
.privacy-note span { color: #72a838; font-size: 13px; }
.feedback { margin: 12px 0 0; font-size: 12px; line-height: 1.45; }
.feedback-error { color: #bc3f4d; }
.preview-heading h2 { max-width: 250px; color: #ffffff; }
.status-pill { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,.12); border-radius: 999px; padding: 7px 10px; color: #b5bac9; font-size: 10px; font-weight: 800; white-space: nowrap; }
.status-pill.is-ready { border-color: rgba(175, 219, 114, .22); color: #b7dc87; }
.status-pill .status-dot { width: 6px; height: 6px; box-shadow: none; background: #828797; }
.status-pill.is-ready .status-dot { background: #9fd360; }
.preview-stage { display: grid; place-items: center; min-height: 455px; margin-top: 28px; border: 1px solid rgba(255,255,255,.1); border-radius: 19px; background: radial-gradient(circle at 50% 42%, #ffffff 0, #f6f7fa 62%, #e9ebf1 100%); }
.preview-stage.is-error { background: #fbebec; }
.qr-paper { display: grid; place-items: center; width: min(76%, 350px); aspect-ratio: 1; border-radius: 13px; padding: 20px; background: #ffffff; box-shadow: 0 18px 35px rgba(18, 21, 37, .13), 0 0 0 1px rgba(18,21,37,.04); }
.qr-image { display: block; width: 100%; height: 100%; object-fit: contain; }
.preview-message { max-width: 270px; padding: 20px; color: #6f4350; text-align: center; }
.preview-message strong { display: block; margin-top: 12px; color: #783f4e; font-size: 14px; }
.preview-message p { margin: 7px 0 0; font-size: 12px; line-height: 1.5; }
.message-icon { display: grid; place-items: center; width: 34px; height: 34px; margin: 0 auto; border-radius: 50%; background: #f2c9ce; color: #963d4f; font-size: 17px; font-weight: 900; }
.preview-loading { color: #6e7280; }
.preview-loading strong { color: #35394a; }
.loading-orbit { display: block; width: 30px; height: 30px; margin: 0 auto; border: 3px solid #dddffa; border-top-color: #5b50db; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.preview-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 18px; }
.preview-meta div { display: flex; flex-direction: column; gap: 5px; border-left: 1px solid rgba(255,255,255,.13); padding-left: 12px; }
.preview-meta div:first-child { border-left: 0; padding-left: 0; }
.preview-meta span { color: #8e93a3; font-size: 10px; font-weight: 700; }
.preview-meta strong { color: #f1f2f7; font-size: 11px; font-weight: 700; }
.preview-tip { display: flex; gap: 10px; align-items: flex-start; margin-top: 25px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 18px; }
.tip-icon { color: #d8ff65; font-size: 16px; line-height: 1.3; }
.preview-tip p { margin: 0; color: #aeb2c0; font-size: 11px; line-height: 1.55; }
.mobile-preview { display: none; }
.footer-note { display: flex; align-items: center; gap: 10px; padding: 26px 4px 8px; color: #9a9eaa; font-size: 11px; }
.footer-note span:first-child { color: #565b6b; font-weight: 800; }
.footer-divider { width: 3px; height: 3px; border-radius: 50%; background: #c1c4cd; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media (max-width: 980px) { .app-shell { padding: 22px; } .intro { padding-top: 66px; } .builder-grid { grid-template-columns: 1fr; } .preview-card { position: relative; top: auto; } }
@media (min-width: 981px) and (max-height: 780px) { .intro { padding-top: 52px; padding-bottom: 28px; } .intro h1 { margin-top: 16px; font-size: clamp(3.5rem, 5vw, 5.4rem); } }
@media (max-width: 620px) { .app-shell { padding: 16px; } .topbar { padding-top: 2px; } .project-links { gap: 13px; } .project-links a { font-size: 11px; } .intro { padding: 63px 2px 32px; } .eyebrow { gap: 7px; font-size: 9px; letter-spacing: .06em; } .eyebrow-divider { display: none; } .intro h1 { margin-top: 16px; font-size: clamp(3.1rem, 16vw, 5rem); } .intro p { font-size: 15px; } .controls-card, .preview-card { border-radius: 21px; padding: 21px; } .field-label { align-items: flex-start; flex-direction: column; gap: 4px; } .mobile-preview { display: grid; place-items: center; min-height: 194px; margin-top: 18px; border: 1px solid #e7e9ef; border-radius: 15px; background: radial-gradient(circle at 50% 42%, #fff 0, #f4f4fa 100%); } .mobile-qr-paper { display: grid; place-items: center; width: 145px; aspect-ratio: 1; border-radius: 10px; padding: 10px; background: #fff; box-shadow: 0 10px 22px rgba(18,21,37,.1); } .mobile-preview-error, .mobile-preview-loading { padding: 20px; color: #6e7280; font-size: 11px; text-align: center; } .mobile-preview-error { color: #983f4f; } .preview-card { display: none; } .option-row { grid-template-columns: 58px minmax(0, 1fr); gap: 12px; } .shape-button { width: 36px; height: 36px; } .shape-button img { width: 25px; height: 25px; } .actions { grid-template-columns: 1fr; } .preview-stage { min-height: 320px; margin-top: 22px; } .qr-paper { width: min(78%, 275px); padding: 14px; } .preview-meta { gap: 7px; } .preview-meta div { padding-left: 8px; } .preview-meta strong { font-size: 10px; } .footer-note { padding-bottom: 0; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
</style>
