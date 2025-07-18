import Konva from 'konva';
export declare function degToRad(a: number): number;
export declare function getCenter(shape: Konva.Shape): {
    x: number;
    y: number;
};
export declare function rotateAroundPoint(shape: Konva.Shape, deltaDeg: number, point: any): void;
export declare function rotateAroundCenter(shape: any, deltaDeg: number): void;
export declare function flip(shape: Konva.Shape, flip: 'h' | 'v' | undefined): void;
