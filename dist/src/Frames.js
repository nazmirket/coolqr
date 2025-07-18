"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Geometry = __importStar(require("./Geometry"));
const konva_1 = __importDefault(require("konva"));
exports.default = {
    square(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            strokeWidth: 30,
            stroke: fill.color,
        });
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            cornerRadius: w / 5,
            strokeWidth: 30,
            stroke: fill.color,
        });
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded2(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            cornerRadius: w / 3,
            strokeWidth: 30,
            stroke: fill.color,
        });
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded3(opts) {
        const { x, y, w, fill, flip } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            cornerRadius: [w / 4, 0, w / 4, 0],
            strokeWidth: 30,
            stroke: fill.color,
        });
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded4(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            cornerRadius: [w / 2, 0, w / 2, 0],
            strokeWidth: 30,
            stroke: fill.color,
        });
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded5(opts) {
        const { x, y, w, fill, flip } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            cornerRadius: [w / 2, 0, w / 4, 0],
            strokeWidth: 30,
            stroke: fill.color,
        });
        Geometry.flip(s1, flip);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded6(opts) {
        const { x, y, w, fill, flip } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            cornerRadius: [0, w / 4, w / 4, w / 4],
            strokeWidth: 30,
            stroke: fill.color,
        });
        Geometry.flip(s1, flip);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    circle(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Ring({
            x: x + w / 2,
            y: y + w / 2,
            innerRadius: w / 3,
            outerRadius: w / 2,
            fill: fill.color,
        });
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    squarecircle(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            strokeWidth: 30,
            stroke: fill.color,
            cornerRadius: w / 12,
        });
        const s2 = new konva_1.default.Rect({
            x: x + 10,
            y: y + 10,
            width: w - 20,
            height: w - 20,
            strokeWidth: 30,
            stroke: fill.color,
            cornerRadius: w / 5,
        });
        const s3 = new konva_1.default.Ring({
            x: x + w / 2,
            y: y + w / 2,
            innerRadius: w / 2.65,
            outerRadius: w / 2,
            fill: fill.color,
        });
        const group = new konva_1.default.Group();
        group.add(s1);
        group.add(s2);
        group.add(s3);
        return group;
    },
};
