import { h } from "vue";
const test = true;
export const G = "G";
export const Svg = "SVG";
export const View = "VIEW";
export const Text = h("p", { id: "TEXT", name: "TEXT" });
export const Link = "LINK";
export const Page = h("div", { id: "PAGE", name: "PAGE" });
export const Note = "NOTE";
export const Path = "PATH";
export const Rect = "RECT";
export const Line = "LINE";
export const Stop = "STOP";
export const Defs = "DEFS";
export const Image = "IMAGE";
export const Tspan = "TSPAN";
export const Canvas = "CANVAS";
export const Circle = "CIRCLE";
export const Ellipse = "ELLIPSE";
export const Polygon = "POLYGON";
export const Document = h("div", { id: "DOCUMENT", name: "DOCUMENT" });

export const Polyline = "POLYLINE";
export const ClipPath = "CLIP_PATH";
export const TextInstance = "TEXT_INSTANCE";
export const LinearGradient = "LINEAR_GRADIENT";
export const RadialGradient = "RADIAL_GRADIENT";
export const StyleSheet = {
  create: (s: any) => s,
};
