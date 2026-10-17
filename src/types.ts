/** The QR Code Model 2 error-correction level. */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

/** The visual treatment of data modules. Structural modules stay square. */
export type DotStyle = 'square' | 'rounded' | 'circle' | 'diamond' | 'hexagon' | 'octagon'

/** The shape used for the outer finder-pattern ring. */
export type FinderStyle = 'square' | 'rounded' | 'circle'

/** The shape used for the dark center of each finder pattern. */
export type FinderInnerStyle = 'square' | 'rounded' | 'circle' | 'diamond'

/** The color treatment used for data modules. */
export type ColorPattern = 'solid' | 'linear' | 'radial' | 'checker'

/** A small image placed over data modules with a solid backing. */
export interface QRLogo {
	/** Data URL, blob URL, or CORS-enabled image URL. */
	src: string
	/** Width as a fraction of the QR symbol, excluding its quiet zone. Default 0.16; maximum 0.2. */
	scale?: number
	/** Clear space around the image, in output pixels. Default 8. */
	padding?: number
	/** Opaque badge color. Default is white. */
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
	/** Shape of data modules. Structural modules remain square. Default square. */
	dotStyle?: DotStyle
	/** Shape of the three finder-pattern rings. Default square. */
	finderStyle?: FinderStyle
	/** Shape of the dark center in each finder pattern. Default square. */
	finderInnerStyle?: FinderInnerStyle
	/** CSS color for finder-pattern rings. Defaults to foreground. */
	finderColor?: string
	/** CSS color for finder-pattern centers. Defaults to finderColor. */
	finderInnerColor?: string
	/** Color pattern for data modules. Default solid. */
	pattern?: ColorPattern
	/** Second dark color used by linear, radial, and checker patterns. */
	accent?: string
	/** Direction of a linear pattern in degrees clockwise from the x axis. Default 45. */
	patternAngle?: number
	/** Optional branded image. Requires error correction level H. */
	logo?: QRLogo
}
