interface JsonNode {
    tag: string;
    attributes?: { [key: string]: any };
    children: (JsonNode | { type: string; content: string })[];
  }
  
  function parseStyle(styleString: string): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    // Dividir la cadena de estilo en pares clave-valor
    styleString.split(';').forEach((style) => {
      const [key, value] = style.split(':');
      if (key && value) {
        styles[key.trim()] = value.trim(); // Agregar al objeto con formato clave-valor
      }
    });
    return styles;
  }
  
  export function htmlToJson(element: HTMLElement): JsonNode {
    const obj: JsonNode = {
      tag: element.getAttribute('data-name') || element.tagName.toLowerCase(),
      children: [],
    };
  
    // Si tiene atributos, agrégaselos
    if (element.attributes) {
      obj.attributes = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        // Verificar si es el atributo "style" para procesarlo como objeto
        if (attr.name === 'style') {
          obj.attributes.style = parseStyle(attr.value);
        } else {
          obj.attributes[attr.name] = attr.value;
        }
      }
    }
  
    // Si tiene hijos, iteramos sobre ellos
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        // Si es un nodo de texto, lo añadimos como texto
        const text = child.textContent?.trim();
        if (text) {
          obj.children.push({
            type: 'text',
            content: text,
          });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Si es un nodo de elemento, lo convertimos recursivamente
        obj.children.push(htmlToJson(child as HTMLElement));
      }
    });
  
    return obj;
  }
  

  