export const PDF = defineComponent({
    name: "PDF",
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