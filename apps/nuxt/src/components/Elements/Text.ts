import { useEventBus } from "@/hook/useEventBus"
import type { Slots } from "vue";
export const Text = defineComponent({
    name: "Text",
    setup(props) {
      const { emit } = useEventBus("trigger");
      const id = useId();
      const slots = useSlots();
      const instance = getCurrentInstance();
      const memorizedSlot = computed(() => {
        return fetch_node(instance?.slots as Slots)
      });
      watch(() => memorizedSlot.value, (newValue) => {
          emit('trigger');
      });
      console.log("PROPS", props);

      return () => h("p", { id, "data-name": "text" }, slots.default?.());
    },
  });


