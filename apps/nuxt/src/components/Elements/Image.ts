
export  function getServerSideProps(src: string): any {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const imageUrl = new URL(src, baseUrl).href;
  
    return imageUrl
  }

export const Image = defineComponent({
    name: "Image",
    props: {
      src: { type: String, required: true },
      alt: { type: String, required: false },
      style: { type: Object, required: false },
    },
    setup(props) {
      const { textAlign } = props.style;

      const fullUrl = getServerSideProps(props.src);
      return () =>
        h(
          "div",
          {
            "data-name": "image",
            style: {
              textAlign,
            },
          },
          h("img", {
            src: fullUrl,
            alt: props?.alt || "image",
            style: {
              ...props.style,
            },
          })
        );
    },
  });