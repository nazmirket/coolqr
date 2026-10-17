<template>
	<main class="utility-page">
		<header class="site-header">
			<a class="brand" href="/" aria-label="CoolQR home"
				><span class="brand-mark" aria-hidden="true">QR</span><span>CoolQR</span></a
			>
			<nav class="header-links" aria-label="Project links"
				><a href="https://github.com/nazmirket/coolqr" target="_blank" rel="noreferrer"
					>GitHub <span aria-hidden="true">↗</span></a
				><a href="https://www.npmjs.com/package/coolqr" target="_blank" rel="noreferrer"
					>NPM <span aria-hidden="true">↗</span></a
				></nav
			>
		</header>

		<section class="page-intro" aria-labelledby="page-title">
			<p class="eyebrow"
				><span class="eyebrow-dot" aria-hidden="true"></span>Private, browser-side QR
				utility</p
			>
			<h1 id="page-title">Create a QR code in seconds.</h1>
			<p class="intro-copy"
				>Paste a link or message, add your mark, and download a clean PNG. Nothing leaves
				your browser.</p
			>
		</section>

		<section class="builder" aria-label="QR code builder">
			<div class="form-panel">
				<div class="panel-heading"
					><div><p class="step-label">01 / Content</p><h2>What should it open?</h2></div
					><span class="counter" aria-live="polite">{{ data.length }}/2000</span></div
				>
				<label class="field-label" for="qr-content">URL or message</label>
				<textarea
					id="qr-content"
					v-model="data"
					maxlength="2000"
					rows="3"
					placeholder="https://example.com"
					@keydown.meta.enter.prevent="download"
					@keydown.ctrl.enter.prevent="download"
				></textarea>
				<p class="field-help"
					>URLs, plain text, contact details, and short notes all work.</p
				>
				<div class="examples" aria-labelledby="examples-title"
					><span id="examples-title" class="micro-label">Try an example</span
					><div class="example-list"
						><button
							v-for="example in examples"
							:key="example.label"
							type="button"
							class="example-button"
							@click="applyExample(example)"
							><span class="example-icon" aria-hidden="true">{{ example.icon }}</span
							><span>{{ example.label }}</span></button
						></div
					></div
				>

				<div class="divider"></div>
				<div class="panel-heading compact"
					><div><p class="step-label">02 / Style</p><h2>Keep it on brand</h2></div></div
				>
				<div class="color-row"
					><label class="color-field" for="ink-color"
						><span class="micro-label">Ink</span
						><span class="color-input-wrap"
							><input id="ink-color" v-model="inkColor" type="color" /><code>{{
								inkColor
							}}</code></span
						></label
					><label class="color-field" for="background-color"
						><span class="micro-label">Background</span
						><span class="color-input-wrap"
							><input
								id="background-color"
								v-model="backgroundColor"
								type="color"
							/><code>{{ backgroundColor }}</code></span
						></label
					></div
				>
				<div class="select-row"
					><label class="select-field" for="dot-shape"
						><span class="micro-label">Dot shape</span
						><select id="dot-shape" v-model="dotStyle"
							><option v-for="style in dotStyles" :key="style" :value="style">{{
								styleLabel(style)
							}}</option></select
						></label
					><label class="select-field" for="eye-shape"
						><span class="micro-label">Corner shape</span
						><select id="eye-shape" v-model="finderStyle"
							><option v-for="style in finderStyles" :key="style" :value="style">{{
								styleLabel(style)
							}}</option></select
						></label
					></div
				>

				<div class="divider"></div>
				<div class="panel-heading compact"
					><div
						><p class="step-label">03 / Brand mark</p
						><h2>Put your logo in the middle</h2></div
					><span v-if="logoSrc" class="active-label">Added</span></div
				>
				<p class="field-help logo-help"
					>Use a simple, high-contrast mark for the most reliable scans.</p
				>
				<div class="logo-row"
					><div v-if="logoSrc" class="logo-preview" aria-label="Uploaded logo preview"
						><img :src="logoSrc" alt="Uploaded brand logo" /></div
					><label v-else class="upload-drop" for="logo-file"
						><span class="upload-plus" aria-hidden="true">+</span
						><span
							><strong>Upload a logo</strong><small>PNG, JPG, SVG, or WebP</small></span
						></label
					><div v-if="logoSrc" class="logo-file-info"
						><strong>{{ logoName }}</strong
						><button type="button" class="text-button" @click="removeLogo"
							>Remove</button
						></div
					><input
						id="logo-file"
						ref="logoInput"
						class="visually-hidden"
						type="file"
						accept="image/png,image/jpeg,image/svg+xml,image/webp"
						@change="handleLogoChange"
				/></div>
				<p v-if="logoError" class="feedback error" role="alert">{{ logoError }}</p>
				<button
					class="download-button"
					type="button"
					:disabled="!preview || status === 'generating'"
					@click="download"
					><span>{{
						status === 'generating' ? 'Creating preview…' : 'Download PNG'
					}}</span
					><span aria-hidden="true">↓</span></button
				><p class="shortcut-hint"
					>Press <kbd>⌘</kbd> <span aria-hidden="true">↵</span> to download</p
				>
			</div>

			<aside class="preview-panel" aria-labelledby="preview-title">
				<div class="preview-topline"
					><div
						><p class="step-label">Live preview</p
						><h2 id="preview-title">Your code</h2></div
					><span class="status" :class="`status-${status}`"
						><span class="status-dot" aria-hidden="true"></span>{{ statusLabel }}</span
					></div
				>
				<div class="preview-stage" :class="{ 'has-error': status === 'error' }"
					><div ref="canvasHost" class="render-host" aria-hidden="true"></div
					><div v-if="preview" class="qr-paper"
						><img :src="preview" alt="Generated QR code" /></div
					><div
						v-else-if="status === 'error'"
						class="empty-state error-state"
						role="alert"
						><span class="state-icon" aria-hidden="true">!</span
						><strong>Couldn’t create this code</strong><p>{{ renderError }}</p></div
					><div v-else class="empty-state" aria-live="polite"
						><span class="state-icon empty-icon" aria-hidden="true">⌁</span
						><strong>{{
							status === 'generating' ? 'Creating your preview' : 'Add content to begin'
						}}</strong
						><p>{{
							status === 'generating'
								? 'This stays on your device.'
								: 'Your QR code will appear here.'
						}}</p></div
					></div
				>
				<div class="scan-guide"
					><div class="scan-guide-icon" aria-hidden="true">✓</div
					><div
						><strong>Scan friendly by default</strong
						><p
							>Keep strong contrast and leave a quiet margin around the code. Test it at
							the size you plan to share.</p
						></div
					></div
				>
				<dl class="preview-details"
					><div><dt>Output</dt><dd>PNG</dd></div
					><div><dt>Resolution</dt><dd>512 × 512</dd></div
					><div><dt>Privacy</dt><dd>On device</dd></div></dl
				>
			</aside>
		</section>
		<footer class="site-footer"
			><span>CoolQR</span><span aria-hidden="true">·</span
			><span>Open-source QR styling for the web</span></footer
		>
	</main>
</template>

<script setup lang="ts">
import type { RenderOptions } from 'coolqr'

type Example = {
	label: string
	icon: string
	data: string
	dot: 'square' | 'rounded' | 'circle'
	eye: 'square' | 'rounded'
}

const data = ref('https://example.com')
const preview = ref('')
const renderError = ref('')
const logoError = ref('')
const logoName = ref('')
const logoSrc = ref('')
const status = ref<'idle' | 'generating' | 'ready' | 'error'>('generating')
const canvasHost = ref<HTMLDivElement | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)
const rendered = ref<HTMLCanvasElement | undefined>()
const dotStyles: NonNullable<RenderOptions['dotStyle']>[] = [
	'square',
	'rounded',
	'circle',
]
const finderStyles: NonNullable<RenderOptions['finderStyle']>[] = ['square', 'rounded']
const examples: Example[] = [
	{
		label: 'Portfolio',
		icon: '↗',
		data: 'https://example.com/portfolio',
		dot: 'rounded',
		eye: 'rounded',
	},
	{
		label: 'Wi-Fi setup',
		icon: '⌁',
		data: 'WIFI:T:WPA;S:Studio Guest;P:hello-coolqr;;',
		dot: 'circle',
		eye: 'square',
	},
	{
		label: 'Event invite',
		icon: '✦',
		data: 'You are invited! Friday at 19:00. Bring a friend.',
		dot: 'rounded',
		eye: 'rounded',
	},
]
const options = ref<RenderOptions>({
	size: 512,
	foreground: '#16181d',
	background: '#ffffff',
	dotStyle: 'rounded',
	finderStyle: 'rounded',
})
const inkColor = computed({
	get: () => options.value.foreground ?? '#16181d',
	set: (color: string) => {
		options.value.foreground = color
	},
})
const backgroundColor = computed({
	get: () => options.value.background ?? '#ffffff',
	set: (color: string) => {
		options.value.background = color
	},
})
const dotStyle = computed({
	get: () => options.value.dotStyle ?? 'rounded',
	set: (style: RenderOptions['dotStyle']) => {
		options.value.dotStyle = style
	},
})
const finderStyle = computed({
	get: () => options.value.finderStyle ?? 'rounded',
	set: (style: RenderOptions['finderStyle']) => {
		options.value.finderStyle = style
	},
})
const statusLabel = computed(
	() =>
		(
			({
				idle: 'Waiting',
				generating: 'Updating',
				ready: 'Ready',
				error: 'Needs attention',
			}) as Record<typeof status.value, string>
		)[status.value],
)
let renderSequence = 0
let logoObjectUrl = ''
type RenderFunction = (
	data: string,
	options?: RenderOptions,
) => Promise<HTMLCanvasElement>
let renderFunction: RenderFunction | undefined

async function getRenderFunction() {
	if (!renderFunction) {
		const module = (await import('coolqr')) as unknown as {
			renderQR?: RenderFunction
			default?: { renderQR?: RenderFunction }
		}
		renderFunction = module.renderQR ?? module.default?.renderQR
	}
	if (!renderFunction) throw new Error('CoolQR renderer is unavailable.')
	return renderFunction
}
async function render() {
	const sequence = ++renderSequence
	canvasHost.value?.replaceChildren()
	rendered.value = undefined
	preview.value = ''
	renderError.value = ''
	if (!data.value.trim()) {
		status.value = 'idle'
		return
	}
	status.value = 'generating'
	await nextTick()
	try {
		const canvas = await (await getRenderFunction())(data.value, options.value)
		if (sequence !== renderSequence) {
			canvas.remove()
			return
		}
		rendered.value = canvas
		canvasHost.value?.replaceChildren(canvas)
		preview.value = canvas.toDataURL('image/png')
		status.value = 'ready'
	} catch (error) {
		if (sequence !== renderSequence) return
		status.value = 'error'
		renderError.value =
			error instanceof Error ? error.message : 'Unable to generate a QR code.'
	}
}
function applyExample(example: Example) {
	data.value = example.data
	dotStyle.value = example.dot
	finderStyle.value = example.eye
}
function styleLabel(style: string) {
	return style.replace(/^./, letter => letter.toUpperCase())
}
function handleLogoChange(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0]
	if (!file) return
	if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) {
		logoError.value = 'Choose a PNG, JPG, SVG, or WebP image.'
		return
	}
	if (file.size > 2 * 1024 * 1024) {
		logoError.value = 'Choose an image smaller than 2 MiB.'
		return
	}
	logoError.value = ''
	if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl)
	logoObjectUrl = URL.createObjectURL(file)
	logoSrc.value = logoObjectUrl
	logoName.value = file.name
	options.value.logo = {
		src: logoObjectUrl,
		scale: 0.16,
		padding: 8,
		background: '#ffffff',
	}
}
function removeLogo() {
	if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl)
	logoObjectUrl = ''
	logoSrc.value = ''
	logoName.value = ''
	logoError.value = ''
	options.value.logo = undefined
	if (logoInput.value) logoInput.value.value = ''
}
function download() {
	if (!rendered.value || !preview.value) return
	const link = document.createElement('a')
	link.download = 'coolqr.png'
	link.href = rendered.value.toDataURL('image/png')
	link.click()
}
onMounted(() => void render())
watch([data, options], () => void render(), { deep: true })
onBeforeUnmount(() => {
	renderSequence++
	rendered.value?.remove()
	canvasHost.value?.replaceChildren()
	if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl)
})
</script>

<style>
:root {
	color-scheme: light;
	font-family:
		Inter,
		ui-sans-serif,
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		sans-serif;
	font-synthesis: none;
}
* {
	box-sizing: border-box;
}
body {
	margin: 0;
	background: #f7f7f5;
	color: #17191d;
}
button,
input,
textarea,
select {
	font: inherit;
}
button,
select {
	cursor: pointer;
}
.utility-page {
	width: min(1120px, calc(100% - 48px));
	margin: 0 auto;
	padding: 28px 0 34px;
}
.site-header,
.preview-topline,
.panel-heading {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20px;
}
.site-header {
	align-items: center;
}
.brand {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	color: #17191d;
	font-size: 17px;
	font-weight: 800;
	letter-spacing: -0.04em;
	text-decoration: none;
}
.brand-mark {
	display: grid;
	place-items: center;
	width: 34px;
	height: 34px;
	border-radius: 9px;
	background: #17191d;
	color: #d8fb65;
	font-size: 10px;
	font-weight: 900;
	letter-spacing: -0.08em;
}
.header-links {
	display: flex;
	gap: 20px;
}
.header-links a {
	color: #70736f;
	font-size: 12px;
	font-weight: 700;
	text-decoration: none;
}
.header-links a:hover,
.header-links a:focus-visible {
	color: #17191d;
}
.page-intro {
	max-width: 640px;
	padding: 92px 0 42px;
}
.eyebrow,
.step-label,
.micro-label {
	color: #777b76;
	font-size: 10px;
	font-weight: 800;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}
.eyebrow {
	display: flex;
	align-items: center;
	gap: 8px;
	margin: 0;
}
.eyebrow-dot,
.status-dot {
	display: inline-block;
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: #6ea43c;
}
.page-intro h1 {
	max-width: 610px;
	margin: 18px 0 12px;
	font-size: clamp(2.8rem, 7vw, 5.6rem);
	letter-spacing: -0.09em;
	line-height: 0.93;
}
.intro-copy {
	max-width: 470px;
	margin: 0;
	color: #777b76;
	font-size: 16px;
	line-height: 1.55;
}
.builder {
	display: grid;
	grid-template-columns: minmax(0, 0.93fr) minmax(380px, 1.07fr);
	align-items: start;
	gap: 20px;
}
.form-panel,
.preview-panel {
	border: 1px solid #e4e5e1;
	border-radius: 18px;
}
.form-panel {
	padding: 26px;
	background: #fff;
}
.preview-panel {
	position: sticky;
	top: 18px;
	padding: 26px;
	background: #1a1d22;
	color: #fff;
}
.step-label {
	margin: 0 0 7px;
	color: #8a8e87;
}
.preview-panel .step-label {
	color: #9ea39c;
}
.panel-heading h2,
.preview-topline h2 {
	margin: 0;
	font-size: 20px;
	letter-spacing: -0.045em;
	line-height: 1.1;
}
.counter,
.active-label {
	color: #999d96;
	font-size: 11px;
	font-weight: 700;
}
.active-label {
	color: #82b94d;
}
.field-label {
	display: block;
	margin: 28px 0 9px;
	color: #3e423d;
	font-size: 12px;
	font-weight: 800;
}
textarea {
	display: block;
	width: 100%;
	min-height: 102px;
	resize: vertical;
	border: 1px solid #dfe1dc;
	border-radius: 11px;
	outline: 0;
	padding: 14px;
	background: #fafaf8;
	color: #17191d;
	font-size: 15px;
	line-height: 1.45;
}
textarea:focus {
	border-color: #5e63d8;
	box-shadow: 0 0 0 3px #e6e7ff;
	background: #fff;
}
textarea::placeholder {
	color: #a5a9a1;
}
.field-help {
	margin: 8px 0 0;
	color: #969a93;
	font-size: 11px;
	line-height: 1.45;
}
.examples {
	margin-top: 19px;
}
.example-list {
	display: flex;
	flex-wrap: wrap;
	gap: 7px;
	margin-top: 9px;
}
.example-button {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	border: 1px solid #e1e3df;
	border-radius: 999px;
	padding: 8px 10px;
	background: #fff;
	color: #4e534d;
	font-size: 11px;
	font-weight: 700;
}
.example-button:hover,
.example-button:focus-visible {
	border-color: #7a7fe4;
	color: #4f54c0;
}
.example-icon {
	color: #6269d4;
	font-size: 13px;
}
.divider {
	height: 1px;
	margin: 26px 0;
	background: #eceee9;
}
.compact {
	align-items: center;
}
.color-row,
.select-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 11px;
	margin-top: 19px;
}
.select-row {
	margin-top: 14px;
}
.color-field,
.select-field {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
.color-input-wrap {
	display: flex;
	align-items: center;
	gap: 8px;
	border: 1px solid #e1e3df;
	border-radius: 9px;
	padding: 6px 9px;
	background: #fafaf8;
}
.color-input-wrap input {
	width: 26px;
	height: 26px;
	padding: 0;
	border: 0;
	border-radius: 6px;
	background: transparent;
	cursor: pointer;
}
.color-input-wrap code {
	color: #62665f;
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	font-size: 10px;
}
select {
	width: 100%;
	min-height: 39px;
	border: 1px solid #e1e3df;
	border-radius: 9px;
	padding: 0 10px;
	outline: 0;
	background: #fafaf8;
	color: #454a44;
	font-size: 12px;
}
select:focus {
	border-color: #7a7fe4;
	box-shadow: 0 0 0 3px #e6e7ff;
}
.logo-help {
	margin-top: 9px;
}
.logo-row {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-top: 15px;
	min-height: 57px;
}
.upload-drop {
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
	border: 1px dashed #c9cdc5;
	border-radius: 10px;
	padding: 10px 12px;
	background: #fbfbf9;
	cursor: pointer;
}
.upload-drop:hover,
.upload-drop:focus-within {
	border-color: #6f75dc;
	background: #f8f8ff;
}
.upload-plus {
	display: grid;
	place-items: center;
	width: 30px;
	height: 30px;
	border-radius: 7px;
	background: #ececff;
	color: #5c62c9;
	font-size: 20px;
	font-weight: 400;
}
.upload-drop strong,
.upload-drop small {
	display: block;
}
.upload-drop strong {
	color: #474c46;
	font-size: 12px;
}
.upload-drop small {
	margin-top: 3px;
	color: #989d94;
	font-size: 10px;
}
.logo-preview {
	display: grid;
	place-items: center;
	width: 57px;
	height: 57px;
	flex: 0 0 57px;
	border: 1px solid #e1e3df;
	border-radius: 10px;
	padding: 8px;
	background: #fff;
}
.logo-preview img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
.logo-file-info {
	min-width: 0;
}
.logo-file-info strong {
	display: block;
	max-width: 220px;
	overflow: hidden;
	color: #525750;
	font-size: 11px;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.text-button {
	margin-top: 5px;
	border: 0;
	padding: 0;
	background: transparent;
	color: #5f65cf;
	font-size: 11px;
	font-weight: 700;
}
.text-button:hover {
	text-decoration: underline;
}
.feedback {
	margin: 8px 0 0;
	font-size: 11px;
	line-height: 1.45;
}
.error {
	color: #b44b57;
}
.download-button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 50px;
	margin-top: 26px;
	border: 0;
	border-radius: 10px;
	padding: 0 15px;
	background: #5b5fd1;
	color: #fff;
	font-size: 13px;
	font-weight: 800;
	box-shadow: 0 8px 18px rgba(91, 95, 209, 0.2);
}
.download-button:hover:not(:disabled) {
	background: #494db9;
}
.download-button:focus-visible {
	outline: 3px solid #bfc1ff;
	outline-offset: 3px;
}
.download-button:disabled {
	cursor: not-allowed;
	opacity: 0.45;
}
.shortcut-hint {
	margin: 10px 0 0;
	color: #a2a69f;
	font-size: 10px;
	text-align: center;
}
kbd {
	border: 1px solid #d5d8d2;
	border-radius: 4px;
	padding: 1px 4px;
	background: #f7f7f5;
	color: #686d65;
	font-size: 10px;
}
.preview-panel h2 {
	color: #fff;
}
.status {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	border: 1px solid rgba(255, 255, 255, 0.13);
	border-radius: 999px;
	padding: 7px 9px;
	color: #a6aba4;
	font-size: 10px;
	font-weight: 800;
}
.status-ready {
	border-color: rgba(157, 206, 105, 0.25);
	color: #a2d36f;
}
.status-error {
	border-color: rgba(228, 125, 137, 0.28);
	color: #e38b96;
}
.status-generating .status-dot {
	background: #d4bc59;
}
.status-error .status-dot {
	background: #dc6d7e;
}
.preview-stage {
	display: grid;
	place-items: center;
	min-height: 430px;
	margin-top: 23px;
	border: 1px solid rgba(255, 255, 255, 0.11);
	border-radius: 12px;
	background: #f4f5f1;
}
.preview-stage.has-error {
	background: #fff2f2;
}
.render-host {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	opacity: 0;
	pointer-events: none;
}
.qr-paper {
	display: grid;
	place-items: center;
	width: min(76%, 330px);
	aspect-ratio: 1;
	border-radius: 11px;
	padding: 17px;
	background: #fff;
	box-shadow: 0 15px 35px rgba(15, 18, 22, 0.18);
}
.qr-paper img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: contain;
}
.empty-state {
	max-width: 250px;
	color: #767b74;
	text-align: center;
}
.empty-state strong {
	display: block;
	margin-top: 11px;
	color: #343933;
	font-size: 13px;
}
.empty-state p {
	margin: 6px 0 0;
	font-size: 11px;
	line-height: 1.45;
}
.state-icon {
	display: grid;
	place-items: center;
	width: 32px;
	height: 32px;
	margin: 0 auto;
	border-radius: 50%;
	background: #f2cecf;
	color: #a24b53;
	font-size: 16px;
	font-weight: 900;
}
.empty-icon {
	background: #e7e9ff;
	color: #6269ce;
	font-size: 22px;
}
.error-state strong {
	color: #9e4d54;
}
.scan-guide {
	display: flex;
	gap: 10px;
	align-items: flex-start;
	margin-top: 18px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	padding-top: 17px;
}
.scan-guide-icon {
	display: grid;
	place-items: center;
	width: 22px;
	height: 22px;
	flex: 0 0 22px;
	border-radius: 50%;
	background: #d8fb65;
	color: #1a1d22;
	font-size: 13px;
	font-weight: 900;
}
.scan-guide strong {
	color: #e9ebe7;
	font-size: 11px;
}
.scan-guide p {
	margin: 5px 0 0;
	color: #a6aba4;
	font-size: 10px;
	line-height: 1.5;
}
.preview-details {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	margin: 21px 0 0;
}
.preview-details div {
	border-left: 1px solid rgba(255, 255, 255, 0.12);
	padding-left: 10px;
}
.preview-details div:first-child {
	border-left: 0;
	padding-left: 0;
}
.preview-details dt {
	color: #8f958d;
	font-size: 9px;
	font-weight: 700;
}
.preview-details dd {
	margin: 4px 0 0;
	color: #f2f3ef;
	font-size: 10px;
	font-weight: 700;
}
.site-footer {
	display: flex;
	align-items: center;
	gap: 9px;
	padding-top: 24px;
	color: #a1a59e;
	font-size: 10px;
}
.site-footer span:first-child {
	color: #5c615a;
	font-weight: 800;
}
.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
	clip-path: inset(50%);
}
@media (max-width: 900px) {
	.builder {
		grid-template-columns: 1fr;
	}
	.preview-panel {
		position: relative;
		top: auto;
	}
}
@media (max-width: 600px) {
	.utility-page {
		width: min(100% - 28px, 540px);
		padding-top: 18px;
	}
	.header-links {
		gap: 12px;
	}
	.header-links a {
		font-size: 11px;
	}
	.page-intro {
		padding: 66px 0 30px;
	}
	.page-intro h1 {
		font-size: clamp(2.8rem, 15vw, 4.4rem);
	}
	.form-panel,
	.preview-panel {
		padding: 20px;
		border-radius: 15px;
	}
	.color-row,
	.select-row {
		gap: 8px;
	}
	.preview-stage {
		min-height: 300px;
	}
	.qr-paper {
		width: min(78%, 270px);
		padding: 14px;
	}
}
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		scroll-behavior: auto !important;
		transition-duration: 0.01ms !important;
		animation-duration: 0.01ms !important;
	}
}
</style>
