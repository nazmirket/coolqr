<template>
	<main class="min-h-screen w-full bg-primary-600 p-4 md:p-8">
		<section
			class="mx-auto grid w-full max-w-7xl gap-6 rounded-3xl bg-white p-4 md:grid-cols-2 md:p-12"
		>
			<div class="flex flex-col gap-6 rounded-3xl bg-slate-200 p-4 md:p-6">
				<header class="flex flex-wrap items-end justify-between gap-3 px-2">
					<div>
						<h1 class="text-4xl font-black text-black sm:text-6xl">CoolQR</h1>
						<p class="text-slate-600">A customizable QR code generator.</p>
					</div>
					<nav class="flex gap-3" aria-label="Project links">
						<a
							href="https://github.com/nazmirket/coolqr"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
						</a>
						<a
							href="https://www.npmjs.com/package/coolqr"
							target="_blank"
							rel="noreferrer"
						>
							NPM
						</a>
					</nav>
				</header>

				<label class="flex flex-col gap-2 font-bold text-slate-700">
					<span>Content</span>
					<input
						v-model="data"
						type="text"
						class="h-14 rounded-xl px-5 text-lg font-normal shadow-sm"
						aria-label="QR code content"
					/>
				</label>

				<fieldset class="rounded-2xl bg-slate-300 p-4">
					<legend class="text-xl font-black">Eyes outer</legend>
					<div class="mt-2 flex flex-wrap gap-6">
						<label class="flex flex-col gap-2 text-slate-600">
							<span>Color</span>
							<input
								v-model="options.eyes.outer.fill.color"
								type="color"
								aria-label="Outer eye color"
							/>
						</label>
						<div class="flex flex-col gap-2">
							<span class="text-slate-600">Shape</span>
							<div class="flex flex-wrap gap-2">
								<button
									v-for="shape in outerFrames"
									:key="shape"
									type="button"
									class="rounded-lg border-2 p-1"
									:class="
										options.eyes.outer.shape === shape
											? 'border-primary-700'
											: 'border-transparent'
									"
									:aria-label="`Outer eye ${shape}`"
									@click="options.eyes.outer.shape = shape"
								>
									<img class="h-10 w-10" :src="`/frames/${shape}.svg`" :alt="shape" />
								</button>
							</div>
						</div>
					</div>
				</fieldset>

				<fieldset class="rounded-2xl bg-slate-300 p-4">
					<legend class="text-xl font-black">Eyes inner</legend>
					<div class="mt-2 flex flex-wrap gap-6">
						<label class="flex flex-col gap-2 text-slate-600">
							<span>Color</span>
							<input
								v-model="options.eyes.inner.fill.color"
								type="color"
								aria-label="Inner eye color"
							/>
						</label>
						<div class="flex flex-col gap-2">
							<span class="text-slate-600">Shape</span>
							<div class="flex flex-wrap gap-2">
								<button
									v-for="shape in shapes"
									:key="shape"
									type="button"
									class="rounded-lg border-2 p-1"
									:class="
										options.eyes.inner.shape === shape
											? 'border-primary-700'
											: 'border-transparent'
									"
									:aria-label="`Inner eye ${shape}`"
									@click="options.eyes.inner.shape = shape"
								>
									<img class="h-10 w-10" :src="`/${shape}.svg`" :alt="shape" />
								</button>
							</div>
						</div>
					</div>
				</fieldset>

				<fieldset class="rounded-2xl bg-slate-300 p-4">
					<legend class="text-xl font-black">Dots</legend>
					<div class="mt-2 flex flex-wrap gap-6">
						<label class="flex flex-col gap-2 text-slate-600">
							<span>Color</span>
							<input
								v-model="options.dots.fill.color"
								type="color"
								aria-label="Dot color"
							/>
						</label>
						<div class="flex flex-col gap-2">
							<span class="text-slate-600">Shape</span>
							<div class="flex flex-wrap gap-2">
								<button
									v-for="shape in shapes"
									:key="shape"
									type="button"
									class="rounded-lg border-2 p-1"
									:class="
										options.dots.shape === shape
											? 'border-primary-700'
											: 'border-transparent'
									"
									:aria-label="`Dot ${shape}`"
									@click="options.dots.shape = shape"
								>
									<img class="h-10 w-10" :src="`/${shape}.svg`" :alt="shape" />
								</button>
							</div>
						</div>
					</div>
				</fieldset>

				<div class="mt-auto grid grid-cols-2 gap-3">
					<button
						type="button"
						class="rounded-xl px-4 py-3 text-blue-700"
						@click="copyOptions"
					>
						{{ copied ? 'Copied!' : 'Copy options' }}
					</button>
					<button
						type="button"
						class="rounded-2xl bg-primary-600 px-4 py-3 text-white"
						@click="download"
					>
						Download PNG
					</button>
				</div>
			</div>

			<div class="flex min-h-[24rem] items-center justify-center p-4 md:p-16">
				<div ref="previewContainer" class="sr-only" aria-hidden="true"></div>
				<img
					v-if="preview"
					class="aspect-square w-full object-contain"
					:src="preview"
					alt="Generated CoolQR preview"
				/>
				<p v-else class="text-slate-500">Generating preview…</p>
			</div>
		</section>
	</main>
</template>

<script setup lang="ts">
import CoolQR, { type Frame, type QROptions, type Shape } from 'coolqr'

const data = ref('https://example.com')
const preview = ref('')
const copied = ref(false)
const previewContainer = ref<HTMLDivElement | null>(null)
const renderedStage = ref<Awaited<ReturnType<typeof CoolQR.draw>>>()

const outerFrames: Frame[] = [
	'square',
	'circle',
	'rounded',
	'rounded2',
	'rounded3',
	'rounded4',
	'rounded5',
	'rounded6',
	'squarecircle',
]
const shapes: Shape[] = [
	'square',
	'circle',
	'diamond',
	'rounded',
	'rounded2',
	'rounded3',
	'rounded4',
	'sun',
	'cross',
	'hexagon',
	'octagon',
]

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
	await nextTick()
	if (!previewContainer.value) return

	const stage = await CoolQR.draw(data.value, previewContainer.value, options.value)
	if (sequence !== renderSequence) {
		stage.destroy()
		return
	}

	renderedStage.value = stage
	preview.value = previewContainer.value.querySelector('canvas')?.toDataURL() ?? ''
}

onMounted(() => void render())
watch([data, options], () => void render(), { deep: true })

async function copyOptions() {
	await navigator.clipboard.writeText(JSON.stringify(options.value))
	copied.value = true
	setTimeout(() => {
		copied.value = false
	}, 1000)
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
