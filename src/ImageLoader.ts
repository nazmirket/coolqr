export type CallbackImageLoader<T> = (
	src: string,
	onLoad: (image: T) => void,
	onError: () => void,
) => void

export function loadImage<T>(src: string, loader: CallbackImageLoader<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		loader(src, resolve, () => {
			reject(new Error(`Unable to load QR image: ${src}`))
		})
	})
}
