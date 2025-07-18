"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flip = exports.rotateAroundCenter = exports.rotateAroundPoint = exports.getCenter = exports.degToRad = void 0;
function degToRad(a) {
    return (a / 180) * Math.PI;
}
exports.degToRad = degToRad;
function getCenter(shape) {
    const angleRad = degToRad(shape.rotation() || 0);
    return {
        x: shape.x() +
            (shape.width() / 2) * Math.cos(angleRad) +
            (shape.height() / 2) * Math.sin(-angleRad),
        y: shape.y() +
            (shape.height() / 2) * Math.cos(angleRad) +
            (shape.width() / 2) * Math.sin(angleRad),
    };
}
exports.getCenter = getCenter;
function rotateAroundPoint(shape, deltaDeg, point) {
    const angleRad = degToRad(deltaDeg);
    const x = Math.round(point.x +
        (shape.x() - point.x) * Math.cos(angleRad) -
        (shape.y() - point.y) * Math.sin(angleRad));
    const y = Math.round(point.y +
        (shape.x() - point.x) * Math.sin(angleRad) +
        (shape.y() - point.y) * Math.cos(angleRad));
    const rotation = Math.round(shape.rotation() + deltaDeg);
    shape.x(x);
    shape.y(y);
    shape.rotation(rotation);
}
exports.rotateAroundPoint = rotateAroundPoint;
function rotateAroundCenter(shape, deltaDeg) {
    const center = getCenter(shape);
    rotateAroundPoint(shape, deltaDeg, center);
}
exports.rotateAroundCenter = rotateAroundCenter;
function flip(shape, flip) {
    if (flip === 'h') {
        shape.scaleX(-1);
        shape.x(shape.x() + shape.width());
    }
    else if (flip === 'v') {
        shape.scaleY(-1);
        shape.y(shape.y() + shape.height());
    }
}
exports.flip = flip;
