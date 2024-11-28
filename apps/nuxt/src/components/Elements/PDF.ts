export type Size=  "A4" | "Letter" | "Legal" | "Tabloid" | "Carta" | "Oficio"
export const PDF = defineComponent({
    name: "PDF",
    props: {
      size: {
        type: String as PropType<Size>,
        default: "A4",
      },
    },
    setup(props, { slots }) {
      // Define los tamaños en píxeles
      const width = "795px";
      const height = "1065px";
      const sizes = {
        A4: { width: "793px", height: "1121px" }, // ajuste de tamaño A4
        Letter: { width: "816px", height: "1056px" }, // tamaño Carta o Letter
        Legal: { width: "816px", height: "1344px" }, // tamaño Legal
        Tabloid: { width: "1408px", height: "2240px" }, // Tabloid más grande
        Carta: { width: "816px", height: "1056px" }, // Carta (equivalente a Letter)
        Oficio: { width: "816px", height: "1248px" }, // Oficio
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
              maxWidth: sizes[props.size].width,
              maxHeight: sizes[props.size].height,
              boxSizing: "border-box",
              overflow: "hidden",
              transform: "scale(1)",
            },
          },
          slots.default ? slots.default() : []
        );
    },
  });