import { h, ref, defineComponent, defineCustomElement, PropType } from "vue";

const DocumentRef = ref();

export default defineComponent({
  name: "PDFComponent",
  props: {
    size: {
      type: String as PropType<
        "A4" | "Letter" | "Legal" | "Tabloid" | "Carta" | "Oficio"
      >,
      default: "A4",
    },
  },
  setup(props, { slots }) {
    // Define los tamaños en píxeles
    const width = "795px";
    const height = "1065px";
    const sizes = {
      A4: { width: "795px", height: "1065px" }, // '1123px' },
      Letter: { width: "816px", height: "1044px" },
      Legal: { width: "816px", height: "1344px" },
      Tabloid: { width: "1056px", height: "1632px" },
      Carta: { width: "826px", height: "1056px" },
      Oficio: { width: "826px", height: "1276px" },
    };
    return () =>
      h(
        "div",
        {
          "data-name": "PDF",
          style: {
            padding: "0px",
            margin: "0 auto",
            width: "100%",
            height: "100%",
            maxWidth: width,
            maxHeight: height,
            boxSizing: "border-box",
            overflow: "hidden",
            transform: "scale(1)",
          },
        },
        slots.default ? slots.default() : []
      );
  },
});
export const Document = defineComponent({
  name: "Document",
  setup(_props, { slots }) {
    const width = "795px";
    const height = "1065px";
    return () =>
      h(
        "div",
        {
          "data-name": "DOCUMENT",
          style: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            overflowY: "auto",
            display: "grid",
            gap: "20px",
          },
        },
        [
          slots.default
            ? slots.default()[0].children.map((pageSlot) => {
                pageSlot.props = {
                  ...pageSlot.props,
                  style: {
                    ...pageSlot.props?.style,
                    height,
                    maxHeight: height,
                    backgroundColor: "pink",
                  },
                };
                return pageSlot;
              })
            : null,
        ]
      );
  },
});

export const Page = defineComponent({
  name: "Page",
  setup(_props, { slots }) {
    const id = useId();
    return () =>
      h(
        "div",
        {
          id,
          "data-name": "page",
          style: { backgroundColor: "white" },
        },
        slots.default ? slots.default() : []
      );
  },
});
//h("div", { "data-name": "DOCUMENT", style: });

export const G = h("div", { "data-name": "G" });
export const Svg = h("div", { "data-name": "SVG" });
export const View = h("div", { "data-name": "VIEW" });
export const Text = h("p", { "data-name": "text" });
export const Link = h("div", { "data-name": "link" });

export const Note = h("div", { "data-name": "note" });
export const Path = h("div", { "data-name": "path" });
export const Rect = h("div", { "data-name": "rect" });
export const Line = h("div", { "data-name": "line" });
export const Stop = h("div", { "data-name": "stop" });
export const Defs = h("div", { "data-name": "DEFS" });
export const Image = h("div", { "data-name": "image" });
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
