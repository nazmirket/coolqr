declare const _default: {
    eyes: {
        outer: string[];
        inner: string[];
    };
    dots: string[];
    shapes: {
        [key: string]: (opts: import("..").DrawOpts) => import("konva/lib/Group").Group;
    };
    frames: {
        [key: string]: (opts: import("..").DrawOpts) => import("konva/lib/Group").Group;
    };
};
export default _default;
