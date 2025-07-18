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
            x,
            y,
            width: w,
            height: w,
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x,
            y,
            width: w,
            height: w,
            cornerRadius: w / 5,
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded2(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x,
            y,
            width: w,
            height: w,
            cornerRadius: w / 3,
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded3(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x,
            y,
            width: w,
            height: w,
            cornerRadius: [w / 4, 0, w / 2, 0],
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    rounded4(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Rect({
            x,
            y,
            width: w,
            height: w,
            cornerRadius: [w / 2, w / 2, w / 2, 0],
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    circle(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Circle({
            x: x + w / 2,
            y: y + w / 2,
            radius: w / 2,
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    diamond(opts) {
        const { x, y, w, fill } = opts;
        const x2 = x + (w * Math.sqrt(2) - w) / Math.sqrt(8);
        const y2 = y + (w * Math.sqrt(2) - w) / Math.sqrt(8);
        const w2 = w / Math.sqrt(2);
        const s1 = new konva_1.default.Rect({
            x: x2,
            y: y2,
            width: w2,
            height: w2,
        });
        fillShape(s1, fill, w);
        Geometry.rotateAroundCenter(s1, 45);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    cross(opts) {
        const { x, y, w, fill } = opts;
        const x2 = x;
        const y2 = y + w / 4;
        const w2 = w;
        const s1 = new konva_1.default.Rect({
            x: x2,
            y: y2,
            width: w2,
            height: w2 / 2,
        });
        fillShape(s1, fill, w);
        const s2 = s1.clone();
        Geometry.rotateAroundCenter(s2, 90);
        const group = new konva_1.default.Group();
        group.add(s1);
        group.add(s2);
        return group;
    },
    hexagon(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.RegularPolygon({
            x: x + w / 2,
            y: y + w / 2,
            sides: 6,
            radius: w / 2,
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    sun(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.Star({
            x: x + w / 2,
            y: y + w / 2,
            numPoints: 16,
            innerRadius: w / 3,
            outerRadius: w / 2,
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
    octagon(opts) {
        const { x, y, w, fill } = opts;
        const s1 = new konva_1.default.RegularPolygon({
            x: x + w / 2,
            y: y + w / 2,
            sides: 8,
            radius: w / 2,
        });
        fillShape(s1, fill, w);
        const group = new konva_1.default.Group();
        group.add(s1);
        return group;
    },
};
function fillShape(shape, f, w) {
    try {
        if (!f)
            return;
        if (f.type === 'solid')
            shape.fill(f.color);
        //
        else {
            const { type, colors } = f.gradient;
            if (type === 'linear') {
                shape.fillLinearGradientStartPoint({ x: 0, y: 0 });
                shape.fillLinearGradientEndPoint({ x: w, y: w });
                shape.fillLinearGradientColorStops([0, colors[0], 1, colors[1]]);
            }
            else if (type === 'radial') {
                shape.fillRadialGradientStartPoint({ x: w / 2, y: w / 2 });
                shape.fillRadialGradientEndPoint({ x: w / 2, y: w / 2 });
                shape.fillRadialGradientStartRadius(0);
                shape.fillRadialGradientEndRadius(w);
                shape.fillRadialGradientColorStops([0, colors[0], 1, colors[1]]);
            }
        }
    }
    catch (error) { }
}
