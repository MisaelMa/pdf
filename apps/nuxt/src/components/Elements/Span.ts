export const Span = defineComponent({
  setup() {
    const slots = useSlots();
    const id = useId();

    return () => h("span", { "data-name": "span" }, slots.default?.());
  },
}); // h("div", { "data-name": "SPAN" });
