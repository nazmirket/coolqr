<template>
	<div
		class="min-h-screen w-full flex justify-center items-center md:p-8 p-4 bg-primary-600"
	>
		<div
			class="bg-white rounded-3xl md:p-12 p-4 w-full md:grid md:grid-cols-2 flex flex-col-reverse"
		>
			<div class="w-full bg-slate-200 rounded-3xl p-3 md:p-6 flex flex-col gap-6">
				<div class="w-full px-4 flex justify-center md:justify-start flex-col gap-1">
					<span class="sm:text-[64px] font-black text-black text-[36px]"> CoolQR </span>
					<div class="w-full flex items-center justify-between">
						<span class="text-center md:text-start">
							Made by
							<a
								href="https://instagram.com/codemirket"
								class="font-700 text-primary-700"
							>
								@nazmirket
							</a>
						</span>
						<div class="flex gap-3 items-center">
							<a href="https://github.com/nazmirket/coolqr" target="_blank">
								<img
									src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
									alt="GitHub Repository"
									class="w-6 h-6"
								/>
							</a>

							<a href="https://npmjs.org/coolqr" target="_blank">
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/2560px-Npm-logo.svg.png"
									alt="NPM Page"
									class="h-6"
								/>
							</a>
						</div>
					</div>
				</div>

				<div>
					<input
						v-model="data"
						type="text"
						class="w-full rounded-xl h-16 px-6 text-slate-600 text-[20px] shadow-sm"
					/>
				</div>

				<div class="bg-slate-300 p-4 rounded-2xl flex flex-col gap-1">
					<span class="font-black text-xl">Eyes Outer</span>
					<div class="flex gap-6">
						<div class="flex flex-col gap-2">
							<span class="text-slate-600 font-black">Color</span>
							<div class="flex gap-2">
								<div
									class="w-10 h-10 border-black border-2 flex rounded-full cursor-pointer"
									:style="{
										'background-color': options.eyes.outer.fill.color,
									}"
								>
									<input
										v-model="colors.outer"
										:style="`background-color: ${options.eyes.outer.fill.color}`"
										type="color"
										class="!w-9 !h-9 flex rounded-full opacity-0 cursor-pointer"
									/>
								</div>
							</div>
						</div>

						<div class="flex flex-col gap-2">
							<span class="text-slate-600 font-black">Shape</span>
							<div class="flex gap-2 flex-wrap">
								<a
									v-for="(shape, index) in shapes.eyes.outer.shape"
									:key="index"
									class="shape"
									:class="{ 'is-active': options.eyes.outer.shape === shape }"
									@click="options.eyes.outer.shape = shape as Frame"
								>
									<img class="!w-10 !h-10" :src="`/frames/${shape}.svg`" :alt="shape" />
								</a>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-slate-300 p-4 rounded-2xl flex flex-col gap-1">
					<span class="font-black text-xl">Eyes Inner</span>

					<div class="flex gap-6">
						<div class="flex flex-col gap-2">
							<span class="text-slate-600 font-black">Color</span>
							<div class="flex gap-2 flex-wrap">
								<div
									class="!w-10 !h-10 border-black border-2 flex rounded-full cursor-pointer"
									:style="{
										'background-color': options.eyes.inner.fill.color,
									}"
								>
									<input
										v-model="colors.inner"
										:style="`background-color: ${options.eyes.inner.fill.color}`"
										type="color"
										class="!w-9 !h-9 flex rounded-full opacity-0 cursor-pointer"
									/>
								</div>
							</div>
						</div>
						<div class="rounded-2xl flex flex-col gap-2">
							<span class="text-slate-600 font-black">Shape</span>
							<div class="flex gap-2 flex-wrap">
								<a
									v-for="(shape, index) in shapes.eyes.inner.shape"
									:key="index"
									class="shape"
									:class="{
										'is-active': options.eyes.inner.shape === shape,
									}"
									@click="options.eyes.inner.shape = shape as Shape"
								>
									<img class="w-10 h-10" :src="`/${shape}.svg`" :alt="shape" />
								</a>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-slate-300 p-4 rounded-2xl flex flex-col gap-1">
					<span class="font-black text-xl">Dots</span>
					<div class="flex gap-6">
						<div class="flex flex-col gap-2">
							<span class="text-slate-600 font-black">Color</span>
							<div class="flex gap-2">
								<div
									class="w-10 h-10 border-black border-2 flex rounded-full cursor-pointer"
									:style="{
										'background-color': options.dots.fill.color,
									}"
								>
									<input
										v-model="colors.dots"
										:style="`background-color: ${options.dots.fill.color}`"
										type="color"
										class="!w-9 !h-9 flex rounded-full opacity-0 cursor-pointer"
									/>
								</div>
							</div>
						</div>
						<div class="rounded-2xl flex flex-col gap-2">
							<span class="text-slate-600 font-black">Shape</span>
							<div class="flex gap-2 flex-wrap">
								<a
									v-for="(shape, index) in shapes.dots.shape"
									:key="index"
									class="shape"
									:class="{ 'is-active': options.dots.shape === shape }"
									@click="options.dots.shape = shape as Shape"
								>
									<img class="w-10 h-10" :src="`/${shape}.svg`" :alt="shape" />
								</a>
							</div>
						</div>
					</div>
				</div>

				<div class="flex w-full justify-end mt-auto">
					<div class="grid grid-cols-2">
						<a
							ref="CopyButton"
							class="text-blue-600 px-6 py-4 rounded-xl text-center"
							@click="copy"
						>
							Copy Options
						</a>
						<a
							class="bg-primary-600 text-white px-6 py-4 rounded-2xl whitespace-nowrap"
							@click="download"
						>
							Download PNG
						</a>
					</div>
				</div>
			</div>
			<div class="flex p-4 md:p-16 flex-col gap-6 justify-center items-center h-full">
				<div ref="View" class="hidden"></div>
				<img
					class="w-full h-full aspect-square object-contain"
					:src="View ? View.querySelector('canvas').toDataURL() : ''"
					alt="CoolQR Preview"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
type Shape =
	| 'square'
	| 'circle'
	| 'diamond'
	| 'rounded'
	| 'rounded2'
	| 'rounded3'
	| 'rounded4'
	| 'sun'
	| 'cross'
	| 'hexagon'
	| 'octagon'

type Frame =
	| 'square'
	| 'rounded'
	| 'rounded2'
	| 'rounded3'
	| 'rounded4'
	| 'rounded5'
	| 'rounded6'
	| 'squarecircle'

interface Fill {
	type: 'solid' | 'gradient'
	color: string
	gradient?: {
		type: 'linear' | 'radial'
		colors: string[]
	}
}

interface QROptions {
	size: number
	background: {
		fill: Fill
	}
	eyes: {
		outer: {
			shape: Frame
			fill: Fill
		}
		inner: {
			shape: Shape
			fill: Fill
		}
	}
	dots: {
		shape: Shape
		fill: Fill
	}
	image?: {
		src: string
		margin: number
		hideDots?: boolean
	}
}
</script>

<script setup lang="ts">
import CoolQR from 'coolqr'

const View = ref()
const CopyButton = ref()

const data = ref('URL Here...')
const options = ref<QROptions>({
	background: {
		fill: {
			type: 'solid',
			color: 'white',
		},
	},
	size: 100,
	eyes: {
		outer: {
			shape: 'rounded',
			fill: {
				type: 'solid',
				color: '#A90000',
			},
		},
		inner: {
			shape: 'diamond',
			fill: {
				type: 'solid',
				color: '#A90000',
			},
		},
	},
	dots: {
		shape: 'circle',
		fill: {
			type: 'solid',
			color: 'black',
		},
	},
})

async function render() {
	if (!View.value) return
	CoolQR.draw(data.value, View.value, options.value)
}

onMounted(render)

watch(() => options.value, render, { deep: true })
watch(data, render)

const shapes = ref({
	eyes: {
		inner: {
			shape: [
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
			],
		},
		outer: {
			shape: [
				'square',
				'circle',
				'rounded',
				'rounded2',
				'rounded3',
				'rounded4',
				'rounded5',
				'rounded6',
				'squarecircle',
			],
		},
	},
	dots: {
		shape: [
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
		],
	},
})

function copy() {
	navigator.clipboard.writeText(JSON.stringify(options.value))
	CopyButton.value.innerText = 'Copied!'
	setTimeout(() => {
		CopyButton.value.innerText = 'Copy Options'
	}, 1000)
}

function download() {
	const link = document.createElement('a')
	link.download = 'coolqr.png'
	const canvas = View.value.querySelector('canvas')
	if (!canvas) return
	link.href = canvas.toDataURL('image/png')
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

const colors = ref({
	outer: '#A90000',
	inner: '#A90000',
	dots: 'black',
})

function updateColors() {
	options.value.eyes.outer.fill.color = colors.value.outer
	options.value.eyes.inner.fill.color = colors.value.inner
	options.value.dots.fill.color = colors.value.dots
}

const updateColorTimeout = ref()

watch(
	() => colors.value,
	function () {
		clearTimeout(updateColorTimeout.value)
		updateColorTimeout.value = setTimeout(updateColors, 200)
	},
	{ deep: true }
)
</script>

<style>
a {
	cursor: pointer;
}

a.shape {
	filter: saturate(0) brightness(0);
}

.is-active {
	filter: saturate(100) brightness(100) !important;
}
</style>
