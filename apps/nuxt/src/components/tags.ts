import {
  h,
  defineComponent,
} from "vue";
import { fetch_node } from "../utils";









//h("div", { "data-name": "DOCUMENT", style: });

export const G = h("div", { "data-name": "G" });
export const Svg = h("div", { "data-name": "SVG" });
export const View = h("div", { "data-name": "VIEW" });
export const Link = h("div", { "data-name": "link" });
export const Note = h("div", { "data-name": "note" });
export const Path = h("div", { "data-name": "path" });
export const Rect = h("div", { "data-name": "rect" });
export const Line = h("div", { "data-name": "line" });
export const Stop = h("div", { "data-name": "stop" });
export const Defs = h("div", { "data-name": "DEFS" });
export const Tspan = h("div", { "data-name": "TSPAN" });
export const Canvas = h("div", { "data-name": "CANVAS" });
export const Circle = h("div", { "data-name": "CIRCLE" });
export const Ellipse = h("div", { "data-name": "ELLIPSE" });
export const Polygon = h("div", { "data-name": "POLYGON" });

export const Polyline = h("div", { "data-name": "POLYLINE" });
export const ClipPath = h("div", { "data-name": "CLIP_PATH" });
export const TextInstance = h("div", { "data-name": "TEXT_INSTANCE" });
export const LinearGradient = h("div", { "data-name": "LINEAR_GRADIENT" });
export const RadialGradient = h("div", { "data-name": "RADIAL_GRADIENT" });
// Nuevas constantes para la tabla con etiquetas HTML
export const Table = h("table", { "data-name": "TABLE" });
export const TableHeader = h("thead", { "data-name": "TABLE_HEADER" });
export const TableRow = h("tr", { "data-name": "TABLE_ROW" });
export const TableCell = h("td", { "data-name": "TABLE_CELL" });
export const TableFooter = h("tfoot", { "data-name": "TABLE_FOOTER" });
export const TableBody = h("tbody", { "data-name": "TABLE_BODY" });
export const TableHeaderCell = h("th", { "data-name": "TABLE_HEADER_CELL" });

export const StyleSheet = {
  create: (s: any) => s,
};
