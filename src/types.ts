/** The QR Code Model 2 error-correction level. */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

/** Shape of dark data modules. Scanner landmarks remain square. */
export type DotStyle =
	| 'square'
	| 'rounded'
	| 'circle'
	| 'diamond'
	| 'hexagon'
	| 'octagon'
	| 'squircle'
	| 'leaf'
	| 'horizontal'
	| 'vertical'

/** Whether neighboring dark modules share one contour or remain individual marks. */
export type DotLayout = 'connected' | 'isolated'

/** The shape used for the outer finder-pattern ring. */
export type FinderStyle = 'square' | 'rounded' | 'circle'

/** The shape used for the dark center of each finder pattern. */
export type FinderInnerStyle = 'square' | 'rounded' | 'circle' | 'diamond'

/** The color treatment used for dark modules outside the finder patterns. */
export type ColorPattern = 'solid' | 'linear' | 'radial' | 'checker'

/** A small image placed in a module cutout that follows its visible pixels. */
export interface QRLogo {
	/** Data URL, blob URL, or CORS-enabled image URL. */
	src: string
	/** Longest image side as a fraction of the QR symbol, excluding its quiet zone. Default 0.16; maximum 0.2. */
	scale?: number
	/** Clear space around visible image pixels, in output pixels. Default max(3, round(size / 64)). */
	padding?: number
	/** Optional opaque light badge color. Omit to preserve the QR background and image transparency. */
	background?: string
}

/** Browser canvas rendering options. A four-module quiet zone is always included. */
export interface RenderOptions {
	/** Square canvas width and height in pixels. Default 512. */
	size?: number
	/** Defaults to M, or H when a logo is supplied. Logos require H. */
	errorCorrectionLevel?: ErrorCorrectionLevel
	/** CSS color for dark modules. Default #111827. */
	foreground?: string
	/** CSS color for the background and quiet zone. Default #ffffff. */
	background?: string
	/** Shape of dark data modules. Scanner landmarks remain square. Default square. */
	dotStyle?: DotStyle
	/** Connected contours or individual marks. Default connected. */
	dotLayout?: DotLayout
	/** Shape of the three finder-pattern rings. Default square. */
	finderStyle?: FinderStyle
	/** Shape of the dark center in each finder pattern. Default square. */
	finderInnerStyle?: FinderInnerStyle
	/** CSS color for finder-pattern rings. Defaults to foreground. */
	finderColor?: string
	/** CSS color for finder-pattern centers. Defaults to finderColor. */
	finderInnerColor?: string
	/** Color pattern for dark modules outside the finder patterns. Default solid. */
	pattern?: ColorPattern
	/** Second dark color used by linear, radial, and checker patterns. */
	accent?: string
	/** Direction of a linear pattern in degrees clockwise from the x axis. Default 45. */
	patternAngle?: number
	/** Optional branded image. Requires error correction level H. */
	logo?: QRLogo
}
