"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shapes_1 = __importDefault(require("./Shapes"));
const Frames_1 = __importDefault(require("./Frames"));
exports.default = {
    eyes: {
        outer: [
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
        inner: [
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
    dots: [
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
    shapes: Shapes_1.default,
    frames: Frames_1.default,
};
