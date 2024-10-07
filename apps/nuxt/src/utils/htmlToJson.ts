import type { RendererElement } from "vue";

interface JsonNode {
    tag: string;
    attributes?: { [key: string]: any };
    children: (JsonNode | { type: string; content: string })[];
  }

  function kebabToCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  function extractCoordinates(element: HTMLElement) {
  //  console.log("extractCoordinates", element);
      // Obtener las coordenadas del elemento
  const rect = element.getBoundingClientRect();

  // Obtener el contenedor padre (offsetParent)
  const parent = element.offsetParent as HTMLElement;

  // Si hay un contenedor padre, calcular las coordenadas relativas
  if (parent) {
    const parentRect = parent.getBoundingClientRect();
    return {
      left: rect.left - parentRect.left,
      top: rect.top - parentRect.top,
      width: rect.width,
      height: rect.height
    };
  }

  // Si no hay un contenedor padre, devolver las coordenadas originales
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };
  }
  
  function parseStyle(styleString: string): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    styleString.split(';').forEach((style) => {
      const [key, value] = style.split(':');
      if (key && value) {
        styles[kebabToCamelCase(key.trim())] = value.trim().replace('!important', '').replace('px', '');
      }
    });
    return styles;
  }
  
  export function htmlToJson(element: RendererElement): JsonNode {
    const obj: JsonNode = {
      tag: element.getAttribute('data-name') || element.tagName.toLowerCase(),
      children: [],
    };
  
    // Si tiene atributos, agrégaselos
    if (element.attributes) {
      obj.attributes = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        
        //obj.attributes.style = { ...d}
        if (attr.name === 'style') {
            
          obj.attributes.style = { ...parseStyle(attr.value), ...extractCoordinates(element) };
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
  

  