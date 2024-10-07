import { useEventBus } from "@/hook/useEventBus";
import type { Slots } from "vue";
import { splitTextWithoutSpans } from "./helper";


const TextP = defineComponent({
  name: "TextP",
  setup(props) {
    const id = useId();
    const slots = useSlots();
    return () => h("p", { id, "data-name": "text-p" }, slots.default?.());
  },
});

export const Text = defineComponent({
  name: "Text",
  inheritAttrs: false,
  props: {
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { emit } = useEventBus("trigger");
    
    const idc = useId();
    const slots = useSlots();
    const instance = getCurrentInstance();
    const memorizedSlot = computed(() => {
      const slots_c = fetch_node(instance?.slots as Slots);
      const list_text = slots_c
        .map((pageSlot: VNode) => {
          if (typeof pageSlot.children === "object") {
            const slot = pageSlot.children.default();
            slot[0].props = pageSlot.props || props
            delete slot[0].vNode
            return slot;
          }
          const s =  pageSlot;
          delete s.vNode;
            s.props = { ...pageSlot.props, ...props };
            return s;
        })
        .flat()
        .map((v: any) => {
          return {
            children: v.children,
            props: v.props,
          }
        });
    console.log("slots_c", slots_c);
    console.log("list_text", list_text);
    console.log("splitTextWithoutSpans", splitTextWithoutSpans(list_text, 795));

      return slots_c;
    });
    const childs = [];
    watch(
      () => memorizedSlot.value,
      (newValue) => {
        console.log("slots", memorizedSlot.value);
        const paragraph = instance?.vnode.el;

        /*  console.log(
          "UPDATE Text: Reactivity detected in slot content",
          getLinesFromP(paragraph, 100)
        ); */
        emit("trigger");
      },
      { deep: true, immediate: true, flush: "post" }
    );

    return () => {
      return h(
        "div",
        { id: idc, "data-name": "text-container" },
        h(
          TextP,
          {
            ...props
          },
          () => memorizedSlot.value
        )
      );
    };
  },
});
