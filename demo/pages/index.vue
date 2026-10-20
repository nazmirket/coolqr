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
			<h1 id="page-title">Make your code<br /><em>look like you.</em></h1>
			<p class="intro-copy"
				>Build a QR code with expressive shapes, colors, patterns, and your own mark.
				Everything stays on your device.</p
			>
		</section>

		<section class="builder" aria-label="QR code builder">
			<div class="mobile-preview-bar">
				<button
					type="button"
					class="mobile-preview-button"
					aria-label="Jump to full QR preview"
					@click="jumpToPreview"
				>
					<span class="mobile-preview-thumb" aria-hidden="true"
						><img v-if="preview" :src="preview" alt="" /><span
							v-else
							class="mobile-preview-placeholder"
						></span
					></span>
					<span class="mobile-preview-copy"
						><strong>{{ status === 'ready' ? 'Live preview ready' : statusLabel }}</strong
						><small>{{ styleSummary }}</small></span
					>
					<span class="mobile-preview-arrow" aria-hidden="true">↘</span>
				</button>
			</div>
			<div class="form-panel">
				<section aria-labelledby="content-title">
					<div class="panel-heading"
						><div
							><p class="step-label">01 / Content</p
							><h2 id="content-title">What should it open?</h2></div
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
				</section>

				<div class="divider"></div>

				<section aria-labelledby="design-title">
					<div class="panel-heading"
						><div
							><p class="step-label">02 / Design</p
							><h2 id="design-title">Make it unmistakably yours</h2></div
						><span class="style-count">{{ styleSummary }}</span></div
					>
					<fieldset class="control-group"
						><legend
							><span class="micro-label">Color mood</span
							><span class="control-hint">Start with a palette</span></legend
						><div class="palette-grid"
							><button
								v-for="palette in palettes"
								:key="palette.label"
								type="button"
								class="palette-card"
								:class="{ selected: palette.label === selectedPalette }"
								:aria-pressed="palette.label === selectedPalette"
								@click="applyPalette(palette)"
								><span
									class="palette-swatch"
									:style="paletteStyle(palette)"
									aria-hidden="true"
									><i></i><b></b><u></u></span
								><span>{{ palette.label }}</span
								><span
									v-if="palette.label === selectedPalette"
									class="selected-mark"
									aria-hidden="true"
									>✓</span
								></button
							></div
						></fieldset
					>
					<div class="color-grid"
						><label class="color-field" for="ink-color"
							><span class="micro-label">Base ink</span
							><span class="color-input-wrap"
								><input id="ink-color" v-model="inkColor" type="color" /><code>{{
									inkColor
								}}</code></span
							></label
						><label class="color-field" for="accent-color"
							><span class="micro-label">Accent ink</span
							><span class="color-input-wrap"
								><input id="accent-color" v-model="accentColor" type="color" /><code>{{
									accentColor
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

					<fieldset class="control-group"
						><legend
							><span class="micro-label">Dot composition</span
							><span class="control-hint">How neighboring modules meet</span></legend
						><div class="choice-grid composition-grid"
							><button
								v-for="layout in dotLayouts"
								:key="layout"
								type="button"
								class="choice-card composition-card"
								:class="{ selected: dotLayout === layout }"
								:aria-pressed="dotLayout === layout"
								@click="dotLayout = layout"
								><span
									class="composition-glyph"
									:class="`composition-${layout}`"
									aria-hidden="true"
									><i></i><i></i><i></i></span
								><span class="choice-name">{{
									layout === 'connected' ? 'Connected' : 'Individual'
								}}</span
								><small>{{
									layout === 'connected' ? 'Join dark neighbors' : 'Separate marks'
								}}</small></button
							></div
						><p class="control-note"
							>Connected modules share edges; light spaces stay open.</p
						>
					</fieldset>

					<fieldset class="control-group"
						><legend
							><span class="micro-label">Module silhouette</span
							><span class="control-hint">Shape the data dots</span></legend
						><div class="choice-grid shape-grid"
							><button
								v-for="style in dotStyles"
								:key="style"
								type="button"
								class="choice-card"
								:class="{ selected: dotStyle === style }"
								:aria-pressed="dotStyle === style"
								@click="dotStyle = style"
								><img
									v-if="shapePreviews[style]"
									class="shape-preview"
									:src="shapePreviews[style]"
									alt=""
								/><span v-else class="shape-preview-placeholder" aria-hidden="true"></span
								><span class="choice-name">{{ styleLabel(style) }}</span></button
							></div
						></fieldset
					>
					<fieldset class="control-group"
						><legend
							><span class="micro-label">Finder frame</span
							><span class="control-hint">All target rings</span></legend
						><div class="choice-grid finder-grid"
							><button
								v-for="style in finderStyles"
								:key="style"
								type="button"
								class="choice-card"
								:class="{ selected: finderStyle === style }"
								:aria-pressed="finderStyle === style"
								@click="finderStyle = style"
								><span class="finder-glyph" :class="`finder-${style}`" aria-hidden="true"
									><i><b></b></i></span
								><span class="choice-name">{{ styleLabel(style) }}</span></button
							></div
						></fieldset
					>
					<fieldset class="control-group"
						><legend
							><span class="micro-label">Finder center</span
							><span class="control-hint">All target centers</span></legend
						><div class="choice-grid finder-grid"
							><button
								v-for="style in finderInnerStyles"
								:key="style"
								type="button"
								class="choice-card"
								:class="{ selected: finderInnerStyle === style }"
								:aria-pressed="finderInnerStyle === style"
								@click="finderInnerStyle = style"
								><span
									class="finder-glyph inner"
									:class="`finder-inner-${style}`"
									aria-hidden="true"
									><i><b></b></i></span
								><span class="choice-name">{{ styleLabel(style) }}</span></button
							></div
						></fieldset
					>
					<fieldset class="control-group"
						><legend
							><span class="micro-label">Ink pattern</span
							><span class="control-hint">Add a little movement</span></legend
						><div class="choice-grid pattern-grid"
							><button
								v-for="pattern in patterns"
								:key="pattern"
								type="button"
								class="choice-card pattern-card"
								:class="{ selected: selectedPattern === pattern }"
								:aria-pressed="selectedPattern === pattern"
								@click="selectedPattern = pattern"
								><span
									class="pattern-glyph"
									:class="`pattern-${pattern}`"
									aria-hidden="true"
								></span
								><span class="choice-name">{{ styleLabel(pattern) }}</span></button
							></div
						><p class="control-note"
							>Patterns use both ink colors. Keep both dark enough to preserve
							scanning.</p
						></fieldset
					>
					<div v-if="selectedPattern === 'linear'" class="pattern-angle">
						<label for="pattern-angle"
							><span class="micro-label">Gradient direction</span
							><strong>{{ patternAngle }}°</strong></label
						>
						<input
							id="pattern-angle"
							v-model.number="patternAngle"
							type="range"
							min="0"
							max="360"
							step="1"
							aria-describedby="pattern-angle-help"
						/>
						<p id="pattern-angle-help">Drag to rotate the linear ink across the code.</p>
					</div>
					<div class="finder-colors"
						><label class="color-field" for="finder-color"
							><span class="micro-label">Frame color</span
							><span class="color-input-wrap"
								><input id="finder-color" v-model="finderColor" type="color" /><code>{{
									finderColor
								}}</code></span
							></label
						><label class="color-field" for="finder-inner-color"
							><span class="micro-label">Center color</span
							><span class="color-input-wrap"
								><input
									id="finder-inner-color"
									v-model="finderInnerColor"
									type="color"
								/><code>{{ finderInnerColor }}</code></span
							></label
						></div
					>
				</section>

				<div class="divider"></div>

				<section aria-labelledby="output-title">
					<div class="panel-heading compact"
						><div
							><p class="step-label">03 / Output</p
							><h2 id="output-title">Tune the finish</h2></div
						></div
					>
					<div class="output-grid"
						><label class="select-field" for="output-size"
							><span class="micro-label">Resolution</span
							><select id="output-size" v-model.number="outputSize"
								><option v-for="size in outputSizes" :key="size" :value="size"
									>{{ size }} × {{ size }} px</option
								></select
							></label
						><fieldset class="control-group correction-group"
							><legend><span class="micro-label">Scan resilience</span></legend
							><div class="correction-options"
								><button
									v-for="level in errorLevels"
									:key="level"
									type="button"
									:disabled="Boolean(logoSrc) && level !== 'H'"
									:class="{ selected: effectiveCorrection === level }"
									:aria-pressed="effectiveCorrection === level"
									@click="setCorrection(level)"
									>{{ level }}</button
								></div
							></fieldset
						></div
					>
					<p class="field-help">{{
						logoSrc
							? 'A logo uses the strongest correction level automatically.'
							: 'Higher correction can help decorative designs, at the cost of a denser code.'
					}}</p>
				</section>

				<div class="divider"></div>

				<section aria-labelledby="logo-title">
					<div class="panel-heading compact"
						><div
							><p class="step-label">04 / Brand mark</p
							><h2 id="logo-title">Put your logo in the middle</h2></div
						><span v-if="logoSrc" class="active-label">Added</span></div
					>
					<p class="field-help logo-help"
						>Use a transparent mark for a shaped cutout. Only the dots beneath the mark
						and its padding are removed.</p
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
					<div v-if="logoSrc" class="logo-scale"
						><label for="logo-scale"
							><span class="micro-label">Logo size</span
							><strong>{{ Math.round(logoScale * 100) }}%</strong></label
						><input
							id="logo-scale"
							v-model.number="logoScale"
							type="range"
							min="0.1"
							max="0.2"
							step="0.01"
					/></div>
					<p v-if="logoError" class="feedback error" role="alert">{{ logoError }}</p>
				</section>

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

			<aside ref="previewPanel" class="preview-panel" aria-labelledby="preview-title">
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
				<div class="preview-style-line"
					><span
						class="preview-style-dot"
						:class="`dot-${dotStyle}`"
						aria-hidden="true"
					></span
					><span>{{ styleSummary }}</span
					><span aria-hidden="true">·</span
					><span>{{ styleLabel(selectedPattern) }} ink</span></div
				>
				<div class="scan-guide"
					><div class="scan-guide-icon" aria-hidden="true">✓</div
					><div
						><strong>Contrast checked</strong
						><p
							>Keep strong contrast and leave a quiet margin around the code. Test it at
							the size you plan to share.</p
						></div
					></div
				>
				<dl class="preview-details"
					><div><dt>Output</dt><dd>PNG</dd></div
					><div
						><dt>Resolution</dt><dd>{{ outputSize }} × {{ outputSize }}</dd></div
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
import type {
	ColorPattern,
	DotLayout,
	DotStyle,
	FinderInnerStyle,
	FinderStyle,
	RenderOptions,
} from 'coolqr'

type Pattern = ColorPattern
type Correction = NonNullable<RenderOptions['errorCorrectionLevel']>
type Example = {
	label: string
	icon: string
	data: string
	dot: DotStyle
	layout: DotLayout
	eye: FinderStyle
	center: FinderInnerStyle
	pattern: Pattern
	angle: number
	correction: Correction
	palette: string
}
type Palette = Pick<
	RenderOptions,
	'foreground' | 'accent' | 'background' | 'finderColor' | 'finderInnerColor' | 'pattern'
> & { label: string }

const data = ref('https://example.com')
const preview = ref('')
const shapePreviews = ref<Partial<Record<DotStyle, string>>>({})
const renderError = ref('')
const logoError = ref('')
const logoName = ref('')
const logoSrc = ref('')
const status = ref<'idle' | 'generating' | 'ready' | 'error'>('generating')
const canvasHost = ref<HTMLDivElement | null>(null)
const previewPanel = ref<HTMLElement | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)
const rendered = ref<HTMLCanvasElement | undefined>()
const dotStyles: DotStyle[] = [
	'square',
	'rounded',
	'circle',
	'diamond',
	'hexagon',
	'octagon',
	'squircle',
	'leaf',
	'horizontal',
	'vertical',
]
const dotLayouts: DotLayout[] = ['connected', 'isolated']
const finderStyles: FinderStyle[] = ['square', 'rounded', 'circle']
const finderInnerStyles: FinderInnerStyle[] = ['square', 'rounded', 'circle', 'diamond']
const patterns: Pattern[] = ['solid', 'linear', 'radial', 'checker']
const outputSizes = [512, 1024, 2048]
const errorLevels: Correction[] = ['L', 'M', 'Q', 'H']
const palettes: Palette[] = [
	{
		label: 'Ink & paper',
		foreground: '#17191d',
		accent: '#17191d',
		background: '#ffffff',
		finderColor: '#17191d',
		finderInnerColor: '#17191d',
		pattern: 'solid',
	},
	{
		label: 'Moss studio',
		foreground: '#173c2c',
		accent: '#2f6b4f',
		background: '#f4f8f1',
		finderColor: '#173c2c',
		finderInnerColor: '#2f6b4f',
		pattern: 'linear',
	},
	{
		label: 'Indigo dusk',
		foreground: '#20245d',
		accent: '#4549a3',
		background: '#f4f4ff',
		finderColor: '#20245d',
		finderInnerColor: '#4549a3',
		pattern: 'radial',
	},
	{
		label: 'Berry pop',
		foreground: '#651d43',
		accent: '#9d3264',
		background: '#fff5f9',
		finderColor: '#651d43',
		finderInnerColor: '#9d3264',
		pattern: 'checker',
	},
]
const examples: Example[] = [
	{
		label: 'Portfolio',
		icon: '↗',
		data: 'https://example.com/portfolio',
		dot: 'rounded',
		layout: 'connected',
		eye: 'rounded',
		center: 'diamond',
		pattern: 'linear',
		angle: 45,
		correction: 'M',
		palette: 'Moss studio',
	},
	{
		label: 'Wi-Fi setup',
		icon: '⌁',
		data: 'WIFI:T:WPA;S:Studio Guest;P:hello-coolqr;;',
		dot: 'circle',
		layout: 'isolated',
		eye: 'square',
		center: 'square',
		pattern: 'solid',
		angle: 45,
		correction: 'M',
		palette: 'Ink & paper',
	},
	{
		label: 'Event invite',
		icon: '✦',
		data: 'You are invited! Friday at 19:00. Bring a friend.',
		dot: 'diamond',
		layout: 'connected',
		eye: 'circle',
		center: 'circle',
		pattern: 'radial',
		angle: 45,
		correction: 'M',
		palette: 'Indigo dusk',
	},
]
const selectedPalette = ref('Ink & paper')
const options = ref<RenderOptions>({
	size: 512,
	foreground: '#17191d',
	accent: '#17191d',
	background: '#ffffff',
	dotStyle: 'rounded',
	dotLayout: 'connected',
	finderStyle: 'rounded',
	finderInnerStyle: 'square',
	finderColor: '#17191d',
	finderInnerColor: '#17191d',
	pattern: 'solid',
	patternAngle: 45,
	errorCorrectionLevel: 'M',
})
const outputSize = computed({
	get: () => options.value.size ?? 512,
	set: (size: number) => {
		options.value.size = size
	},
})
const inkColor = computed({
	get: () => options.value.foreground ?? '#17191d',
	set: (color: string) => {
		selectedPalette.value = ''
		options.value.foreground = color
	},
})
const accentColor = computed({
	get: () => options.value.accent ?? '#17191d',
	set: (color: string) => {
		selectedPalette.value = ''
		options.value.accent = color
	},
})
const backgroundColor = computed({
	get: () => options.value.background ?? '#ffffff',
	set: (color: string) => {
		selectedPalette.value = ''
		options.value.background = color
	},
})
const finderColor = computed({
	get: () => options.value.finderColor ?? inkColor.value,
	set: (color: string) => {
		selectedPalette.value = ''
		options.value.finderColor = color
	},
})
const finderInnerColor = computed({
	get: () => options.value.finderInnerColor ?? finderColor.value,
	set: (color: string) => {
		selectedPalette.value = ''
		options.value.finderInnerColor = color
	},
})
const dotStyle = computed({
	get: () => options.value.dotStyle ?? 'rounded',
	set: (style: DotStyle) => {
		options.value.dotStyle = style
	},
})
const dotLayout = computed({
	get: () => options.value.dotLayout ?? 'connected',
	set: (layout: DotLayout) => {
		options.value.dotLayout = layout
	},
})
const finderStyle = computed({
	get: () => options.value.finderStyle ?? 'rounded',
	set: (style: FinderStyle) => {
		options.value.finderStyle = style
	},
})
const finderInnerStyle = computed({
	get: () => options.value.finderInnerStyle ?? 'square',
	set: (style: FinderInnerStyle) => {
		options.value.finderInnerStyle = style
	},
})
const selectedPattern = computed({
	get: () => options.value.pattern ?? 'solid',
	set: (pattern: Pattern) => {
		selectedPalette.value = ''
		options.value.pattern = pattern
	},
})
const patternAngle = computed({
	get: () => options.value.patternAngle ?? 45,
	set: (angle: number) => {
		selectedPalette.value = ''
		options.value.patternAngle = angle
	},
})
const effectiveCorrection = computed(
	() => (logoSrc.value ? 'H' : (options.value.errorCorrectionLevel ?? 'M')) as Correction,
)
const logoScale = computed({
	get: () => options.value.logo?.scale ?? 0.16,
	set: (scale: number) => {
		if (options.value.logo) options.value.logo.scale = scale
	},
})
const styleSummary = computed(
	() =>
		`${styleLabel(dotStyle.value)} · ${dotLayout.value === 'connected' ? 'Connected' : 'Individual'} · ${styleLabel(finderStyle.value)} frame`,
)
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
let stylePreviewSequence = 0
let logoObjectUrl = ''
let renderTimer: ReturnType<typeof setTimeout> | undefined
let correctionBeforeLogo: Correction | undefined
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
async function renderStyleSamples() {
	const sequence = ++stylePreviewSequence
	try {
		const renderer = await getRenderFunction()
		const previews = await Promise.all(
			dotStyles.map(async style => {
				const canvas = await renderer('COOLQR', {
					size: 232,
					dotStyle: style,
					dotLayout: dotLayout.value,
					foreground: '#30334a',
				})
				const crop = document.createElement('canvas')
				crop.width = crop.height = 64
				crop.getContext('2d')?.drawImage(canvas, 96, 96, 64, 64, 0, 0, 64, 64)
				return [style, crop.toDataURL('image/png')] as const
			}),
		)
		if (sequence === stylePreviewSequence)
			shapePreviews.value = Object.fromEntries(previews)
	} catch {
		if (sequence === stylePreviewSequence) shapePreviews.value = {}
	}
}
async function render() {
	const sequence = ++renderSequence
	canvasHost.value?.replaceChildren()
	rendered.value?.remove()
	rendered.value = undefined
	renderError.value = ''
	if (!data.value.trim()) {
		preview.value = ''
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
		preview.value = ''
		renderError.value =
			error instanceof Error ? error.message : 'Unable to generate a QR code.'
	}
}
function applyExample(example: Example) {
	removeLogo()
	data.value = example.data
	const palette = palettes.find(candidate => candidate.label === example.palette)
	if (!palette) return
	selectedPalette.value = palette.label
	options.value = {
		...palette,
		size: 512,
		dotStyle: example.dot,
		dotLayout: example.layout,
		finderStyle: example.eye,
		finderInnerStyle: example.center,
		pattern: example.pattern,
		patternAngle: example.angle,
		errorCorrectionLevel: example.correction,
		logo: undefined,
	}
}
function applyPalette(palette: Palette) {
	selectedPalette.value = palette.label
	options.value = { ...options.value, ...palette }
}
function paletteStyle(palette: Palette) {
	return {
		'--palette-ink': palette.foreground,
		'--palette-accent': palette.accent,
		'--palette-paper': palette.background,
	}
}
function styleLabel(style: string) {
	return style.replace(/^./, letter => letter.toUpperCase())
}
function setCorrection(level: Correction) {
	if (!logoSrc.value) options.value.errorCorrectionLevel = level
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
	if (!correctionBeforeLogo) {
		correctionBeforeLogo = options.value.errorCorrectionLevel ?? 'M'
	}
	options.value.logo = {
		src: logoObjectUrl,
		scale: 0.16,
		padding: 8,
	}
	options.value.errorCorrectionLevel = 'H'
}
function removeLogo() {
	if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl)
	logoObjectUrl = ''
	logoSrc.value = ''
	logoName.value = ''
	logoError.value = ''
	options.value.logo = undefined
	options.value.errorCorrectionLevel = correctionBeforeLogo ?? 'M'
	correctionBeforeLogo = undefined
	if (logoInput.value) logoInput.value.value = ''
}
function download() {
	if (status.value !== 'ready' || !rendered.value || !preview.value) return
	const link = document.createElement('a')
	link.download = 'coolqr.png'
	link.href = rendered.value.toDataURL('image/png')
	link.click()
}
function jumpToPreview() {
	previewPanel.value?.scrollIntoView({
		behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 'auto'
			: 'smooth',
		block: 'start',
	})
}
function scheduleRender() {
	if (renderTimer) clearTimeout(renderTimer)
	renderSequence++
	if (!data.value.trim()) {
		void render()
		return
	}
	status.value = 'generating'
	renderTimer = setTimeout(() => void render(), 90)
}
onMounted(() => {
	void render()
	void renderStyleSamples()
})
watch([data, options], scheduleRender, { deep: true })
watch(dotLayout, () => void renderStyleSamples())
onBeforeUnmount(() => {
	renderSequence++
	stylePreviewSequence++
	if (renderTimer) clearTimeout(renderTimer)
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
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
	outline: 3px solid #bfc1ff;
	outline-offset: 2px;
}
.utility-page {
	width: min(1160px, calc(100% - 48px));
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
	max-width: 700px;
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
	max-width: 680px;
	margin: 18px 0 12px;
	font-size: clamp(2.8rem, 7vw, 5.6rem);
	letter-spacing: -0.09em;
	line-height: 0.93;
}
.page-intro h1 em {
	color: #5b5fd1;
	font-style: normal;
}
.intro-copy {
	max-width: 500px;
	margin: 0;
	color: #777b76;
	font-size: 16px;
	line-height: 1.55;
}
.builder {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(380px, 0.9fr);
	align-items: start;
	gap: 20px;
}
.mobile-preview-bar {
	display: none;
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
.active-label,
.style-count {
	color: #999d96;
	font-size: 11px;
	font-weight: 700;
}
.active-label {
	color: #82b94d;
}
.style-count {
	align-self: center;
	color: #5f65cf;
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
.field-help,
.control-note {
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
.control-group {
	min-width: 0;
	margin: 24px 0 0;
	border: 0;
	padding: 0;
}
.control-group legend {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	width: 100%;
	padding: 0;
}
.control-hint {
	color: #a0a49c;
	font-size: 10px;
}
.palette-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
	margin-top: 11px;
}
.palette-card {
	position: relative;
	display: grid;
	gap: 7px;
	min-width: 0;
	border: 1px solid #e1e3df;
	border-radius: 10px;
	padding: 8px;
	background: #fff;
	color: #555a53;
	font-size: 10px;
	font-weight: 700;
	text-align: left;
}
.palette-card:hover,
.palette-card.selected {
	border-color: #7378dd;
	box-shadow: 0 0 0 2px #e9e9ff;
}
.palette-card.selected {
	color: #4d52b7;
}
.palette-swatch {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	height: 28px;
	border-radius: 6px;
	background: var(--palette-paper);
}
.palette-swatch i,
.palette-swatch b,
.palette-swatch u {
	display: block;
	width: 10px;
	height: 10px;
	background: var(--palette-ink);
}
.palette-swatch b {
	border-radius: 50%;
	background: var(--palette-accent);
}
.palette-swatch u {
	transform: rotate(45deg);
	width: 8px;
	height: 8px;
	background: var(--palette-ink);
}
.selected-mark {
	position: absolute;
	top: 5px;
	right: 6px;
	color: #5b5fd1;
	font-size: 11px;
}
.color-grid,
.finder-colors,
.output-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 9px;
	margin-top: 16px;
}
.finder-colors {
	grid-template-columns: repeat(2, 1fr);
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
	gap: 7px;
	min-width: 0;
	border: 1px solid #e1e3df;
	border-radius: 9px;
	padding: 5px 7px;
	background: #fafaf8;
}
.color-input-wrap input {
	width: 25px;
	height: 25px;
	flex: 0 0 25px;
	padding: 0;
	border: 0;
	border-radius: 6px;
	background: transparent;
	cursor: pointer;
}
.color-input-wrap code {
	overflow: hidden;
	color: #62665f;
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	font-size: 10px;
	text-overflow: ellipsis;
}
.choice-grid {
	display: grid;
	gap: 8px;
	margin-top: 11px;
}
.shape-grid {
	grid-template-columns: repeat(6, 1fr);
}
.composition-grid {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}
.finder-grid {
	grid-template-columns: repeat(4, minmax(0, 1fr));
}
.choice-card {
	display: grid;
	place-items: center;
	gap: 8px;
	min-height: 86px;
	border: 1px solid #e1e3df;
	border-radius: 10px;
	padding: 9px 6px 8px;
	background: #fff;
	color: #686d65;
}
.choice-card:hover,
.choice-card.selected {
	border-color: #7378dd;
	box-shadow: 0 0 0 2px #e9e9ff;
	color: #4f54c0;
}
.choice-name {
	font-size: 10px;
	font-weight: 750;
}
.composition-card {
	grid-template-columns: 42px 1fr;
	grid-template-rows: auto auto;
	justify-items: start;
	align-content: center;
	gap: 3px 12px;
	padding: 12px;
	text-align: left;
}
.composition-card small {
	grid-column: 2;
	color: #858982;
	font-size: 10px;
}
.composition-glyph {
	grid-row: 1 / 3;
	display: flex;
	align-items: center;
	width: 37px;
	height: 25px;
}
.composition-glyph i {
	width: 13px;
	height: 13px;
	background: currentColor;
}
.composition-connected i:first-child {
	border-radius: 7px 0 0 7px;
}
.composition-connected i:last-child {
	border-radius: 0 7px 7px 0;
}
.composition-isolated {
	justify-content: space-between;
}
.composition-isolated i {
	width: 9px;
	height: 9px;
	border-radius: 50%;
}
.shape-preview,
.shape-preview-placeholder {
	display: block;
	width: 58px;
	height: 58px;
	border-radius: 7px;
	background: #fff;
}
.shape-preview-placeholder {
	background: linear-gradient(135deg, #f0f1f0, #dfe1de);
}
.finder-glyph {
	display: grid;
	place-items: center;
	width: 42px;
	height: 42px;
	border: 7px solid currentColor;
	background: currentColor;
}
.finder-glyph i {
	display: grid;
	place-items: center;
	width: 20px;
	height: 20px;
	background: #fff;
}
.finder-glyph b {
	display: block;
	width: 9px;
	height: 9px;
	background: currentColor;
}
.finder-rounded,
.finder-rounded i,
.finder-rounded b {
	border-radius: 5px;
}
.finder-circle,
.finder-circle i,
.finder-circle b {
	border-radius: 50%;
}
.finder-glyph.inner {
	border-width: 5px;
}
.finder-glyph.inner i {
	width: 25px;
	height: 25px;
}
.finder-glyph.inner b {
	width: 12px;
	height: 12px;
}
.finder-inner-rounded,
.finder-inner-rounded i,
.finder-inner-rounded b {
	border-radius: 5px;
}
.finder-inner-circle,
.finder-inner-circle i,
.finder-inner-circle b {
	border-radius: 50%;
}
.finder-inner-diamond b {
	transform: rotate(45deg) scale(0.8);
}
.pattern-grid {
	grid-template-columns: repeat(4, 1fr);
}
.pattern-card {
	min-height: 77px;
}
.pattern-glyph {
	display: block;
	width: 52px;
	height: 27px;
	border-radius: 5px;
	background: #17191d;
}
.pattern-linear {
	background: linear-gradient(115deg, #17191d 10%, #5b5fd1 90%);
}
.pattern-radial {
	background: radial-gradient(circle at 70% 35%, #5b5fd1, #17191d 75%);
}
.pattern-checker {
	background: conic-gradient(#17191d 25%, #5b5fd1 0 50%, #17191d 0 75%, #5b5fd1 0) 0 0 /
		13px 13px;
}
.control-note {
	margin-top: 10px;
}
.pattern-angle {
	margin-top: 15px;
	border: 1px solid #e5e6e2;
	border-radius: 10px;
	padding: 11px 12px 10px;
	background: #fbfbf9;
}
.pattern-angle label {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.pattern-angle label strong {
	color: #5b5fd1;
	font-size: 11px;
}
.pattern-angle input {
	display: block;
	width: 100%;
	margin-top: 9px;
	accent-color: #5b5fd1;
}
.pattern-angle p {
	margin: 6px 0 0;
	color: #969a93;
	font-size: 10px;
}
.select-field select {
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
.correction-group {
	margin: 0;
}
.correction-options {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 5px;
	margin-top: 8px;
}
.correction-options button {
	min-height: 39px;
	border: 1px solid #e1e3df;
	border-radius: 8px;
	background: #fafaf8;
	color: #747970;
	font-size: 11px;
	font-weight: 800;
}
.correction-options button:hover:not(:disabled),
.correction-options button.selected {
	border-color: #7378dd;
	background: #f1f1ff;
	color: #4f54c0;
}
.correction-options button:disabled {
	cursor: not-allowed;
	opacity: 0.35;
}
.logo-help {
	margin-top: 9px;
}
.logo-row {
	display: flex;
	align-items: center;
	gap: 12px;
	min-height: 57px;
	margin-top: 15px;
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
.logo-scale {
	margin-top: 13px;
}
.logo-scale label {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.logo-scale label strong {
	color: #5b5fd1;
	font-size: 11px;
}
.logo-scale input {
	display: block;
	width: 100%;
	margin-top: 9px;
	accent-color: #5b5fd1;
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
.preview-style-line {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 7px;
	margin-top: 16px;
	color: #c5c8c1;
	font-size: 10px;
	font-weight: 700;
}
.preview-style-dot {
	width: 10px;
	height: 10px;
	background: #d8fb65;
}
.preview-style-dot.dot-rounded {
	border-radius: 4px;
}
.preview-style-dot.dot-circle {
	border-radius: 50%;
}
.preview-style-dot.dot-diamond {
	transform: rotate(45deg) scale(0.8);
}
.preview-style-dot.dot-hexagon {
	clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
}
.preview-style-dot.dot-octagon {
	clip-path: polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%);
}
.preview-style-dot.dot-squircle {
	border-radius: 2px;
}
.preview-style-dot.dot-leaf {
	border-radius: 50% 0;
}
.preview-style-dot.dot-horizontal {
	height: 7px;
	border-radius: 50%;
}
.preview-style-dot.dot-vertical {
	width: 7px;
	border-radius: 50%;
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
@media (max-width: 980px) {
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
		padding: 36px 0 26px;
	}
	.page-intro h1 {
		font-size: clamp(2.8rem, 15vw, 4.4rem);
	}
	.form-panel,
	.preview-panel {
		padding: 20px;
		border-radius: 15px;
	}
	.palette-grid {
		grid-template-columns: repeat(2, 1fr);
	}
	.shape-grid {
		grid-template-columns: repeat(3, 1fr);
	}
	.finder-grid,
	.pattern-grid {
		grid-template-columns: repeat(2, 1fr);
	}
	.color-grid,
	.output-grid {
		grid-template-columns: 1fr;
	}
	.mobile-preview-bar {
		display: block;
		position: sticky;
		top: 10px;
		z-index: 4;
		margin-bottom: 10px;
	}
	.mobile-preview-button {
		display: flex;
		align-items: center;
		gap: 11px;
		width: 100%;
		min-height: 62px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 13px;
		padding: 7px 11px;
		background: #1a1d22;
		color: #fff;
		text-align: left;
		box-shadow: 0 10px 24px rgba(15, 18, 22, 0.16);
	}
	.mobile-preview-button:hover {
		border-color: rgba(216, 251, 101, 0.5);
	}
	.mobile-preview-thumb {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		flex: 0 0 46px;
		border-radius: 8px;
		padding: 4px;
		background: #fff;
	}
	.mobile-preview-thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.mobile-preview-placeholder {
		display: block;
		width: 18px;
		height: 18px;
		border: 3px solid #5b5fd1;
		border-radius: 5px;
	}
	.mobile-preview-copy {
		display: grid;
		min-width: 0;
		gap: 3px;
	}
	.mobile-preview-copy strong {
		font-size: 11px;
		font-weight: 800;
	}
	.mobile-preview-copy small {
		overflow: hidden;
		color: #a6aba4;
		font-size: 10px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mobile-preview-arrow {
		margin-left: auto;
		color: #d8fb65;
		font-size: 18px;
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
	* {
		scroll-behavior: auto !important;
		transition-duration: 0.01ms !important;
		animation-duration: 0.01ms !important;
	}
}
</style>
