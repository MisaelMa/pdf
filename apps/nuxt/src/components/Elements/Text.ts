import { useEventBus } from "@/hook/useEventBus"
import type { Slots } from "vue";

/*  function getLinesFromP(element, containerWidth) {
    if (!element) {
        return [];
    }
    console.log("style", element.style);
    const lines = [];
    let currentLine = '';
    let currentWidth = 0;

    // Obtenemos los childNodes del elemento <p>
    const childNodes = Array.from(element.childNodes);

    childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Dividimos el texto en palabras para controlarlas mejor
            const words = node.textContent.split(/(\s+)/);
            words.forEach((word) => {
                const wordWidth = getTextWidth(word, containerWidth);  // Obtenemos el ancho del texto
                if (currentWidth + wordWidth > containerWidth) {
                    // Si la palabra excede el ancho, agregamos la línea actual
                    lines.push(currentLine.trim());
                    currentLine = word;
                    currentWidth = wordWidth;
                } else {
                    currentLine += word;
                    currentWidth += wordWidth;
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
            // Obtenemos el contenido HTML del span
            const spanHTML = node.outerHTML;
            const spanText = node.textContent; // Para obtener el texto del span
            const spanWidth = getTextWidth(spanText, containerWidth);

            if (currentWidth + spanWidth > containerWidth) {
                // Si el span excede el ancho, agregamos la línea actual
                lines.push(currentLine.trim());
                currentLine = spanHTML;
                currentWidth = spanWidth;
            } else {
                currentLine += spanHTML;
                currentWidth += spanWidth;
            }
        }
    });

    // Añadimos la última línea si queda algo pendiente
    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines;
}

// Simulación más precisa para calcular el "ancho" del texto en función del contenedor
function getTextWidth(text, containerWidth) {
    const averageCharWidth = containerWidth / 105;  // Ajustamos el ancho promedio de cada caracter
    return text.length * averageCharWidth;
}
 */
    

function getLinesFromP(element, containerWidth) {
    if (!element) {
        return [];
    }
    
    const lines = [];
    let currentLine = '';
    let currentWidth = 0;

    // Obtener el tamaño de fuente del <p>
    const pFontSize = parseFloat(getFontSize(element)); // Asumiendo que getFontSize es una función que define cómo obtener el tamaño de la fuente del <p>

    // Obtener los childNodes del elemento <p>
    const childNodes = Array.from(element.childNodes);

    childNodes.forEach((node) => {
        let fontSize = pFontSize; // Por defecto, el tamaño de la fuente es el del <p>

        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(/(\s+)/);
            words.forEach((word) => {
                const wordWidth = getTextWidth(word, fontSize, containerWidth);
                if (currentWidth + wordWidth > containerWidth) {
                    lines.push(currentLine.trim());
                    currentLine = word;
                    currentWidth = wordWidth;
                } else {
                    currentLine += word;
                    currentWidth += wordWidth;
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
            // Obtener el tamaño de fuente del <span> (asumiendo que el estilo se pasa como parámetro)
            fontSize = parseFloat(getFontSize(node)); // También asumimos que getFontSize puede obtener el tamaño de fuente de un <span>
            
            const spanHTML = node.outerHTML;
            const spanText = node.textContent;
            const spanWidth = getTextWidth(spanText, fontSize, containerWidth);

            if (currentWidth + spanWidth > containerWidth) {
                lines.push(currentLine.trim());
                currentLine = spanHTML;
                currentWidth = spanWidth;
            } else {
                currentLine += spanHTML;
                currentWidth += spanWidth;
            }
        }
    });

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines;
}

// Función para obtener el tamaño de la fuente
function getFontSize(element) {
    if (element && element.style && element.style.fontSize) {
        return element.style.fontSize; // Retorna el tamaño de fuente del elemento si está definido
    }
    return '16px'; // Retorna un tamaño de fuente por defecto si no está definido
}

// Función para calcular el ancho del texto en función del tamaño de la fuente
function getTextWidth(text, fontSize, containerWidth) {
    const averageCharWidth = (containerWidth / 105) * (fontSize / 16);
    return text.length * averageCharWidth;
}

    
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
        const paragraph = instance?.vnode.el
       
        console.log("UPDATE Text: Reactivity detected in slot content",   getLinesFromP(paragraph, 795));
       // console.log("UPDATE Text: Reactivity detected in slot content",  memorizedSlot.value);
        emit('trigger');
      }, { deep: true , immediate: true});


      
      return () => h("p", { id, "data-name": "text", style:{margin: 0} }, slots.default?.());
    },
  });


