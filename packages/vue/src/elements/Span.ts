import { defineComponent, h, useSlots, useId } from "vue";

export const Span = defineComponent({
  setup() {
    const slots = useSlots();
    const id = useId();

    return () => h("span", {id, "data-name": "span", style:{ lineHeight: .4 } }, slots.default?.());
  },
}); // h("div", { "data-name": "SPAN" });



