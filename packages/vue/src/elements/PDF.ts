import { defineComponent, h, PropType } from "vue";

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
   
      return () =>
        h(
          "div",
          {
            "data-name": "PDF",
            style: {
              padding: "0px",
              margin: "0px",
              width: "100%",
              height: "100vh",
              maxWidth: width,
              boxSizing: "border-box",
              transform: "scale(1)",
            },
          },
          slots.default ? slots.default() : []
        );
    },
  });