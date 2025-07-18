import { QROptions } from '../index';
import Konva from 'konva';
declare function draw(data: string, container: HTMLDivElement, options: QROptions): Promise<Konva.Stage>;
declare const _default: {
    draw: typeof draw;
    catalog: {
        eyes: {
            outer: string[];
            inner: string[];
        };
        dots: string[];
        shapes: {
            [key: string]: (opts: import("../index").DrawOpts) => import("konva/lib/Group").Group;
        };
        frames: {
            [key: string]: (opts: import("../index").DrawOpts) => import("konva/lib/Group").Group;
        };
    };
};
export default _default;
