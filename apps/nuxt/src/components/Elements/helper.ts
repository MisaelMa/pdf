export function splitTextWithoutSpans(elements, containerWidth) {
    const lines: any = [];
    let currentLine = [];
    let currentWidth = 0;
    const pFontSize = parseFloat(getFontSize({}));
    const nodeParagraphs: any = {
        type: "paragraph",
        children: [],
      }
    elements.forEach((node) => {
      let fontSize = parseFloat(getFontSize(node.props)) || pFontSize;
  
      const nodeTextWidth = getTextWidth(node.children, fontSize, containerWidth);
      const cu = Number(currentWidth) + Number(nodeTextWidth);
      if (cu >= containerWidth && cu < containerWidth) {
        lines.push({...nodeParagraphs});
        nodeParagraphs.children = [];
        currentWidth = 0;
      } 
      if (cu <= containerWidth) {
        // Si todo el node.children cabe en la línea actual, lo agregamos directamente
        nodeParagraphs.children.push({
          type: "text",
          children: node.children,
        });
        currentWidth += nodeTextWidth;
      } else {
         // Si no cabe, lo dividimos en palabras
         const words = node.children.split(/(\s+)/);
         let line_local = ''; // Acumular texto de la línea

          words.forEach((word, i) => {
             const wordWidth = getTextWidth(word, fontSize, containerWidth);
             const cu = Number(currentWidth) + Number(wordWidth);
       

             if (cu >= containerWidth) {
                 if (line_local.trim().length > 0) {
                  nodeParagraphs.children.push({
                      type: "text",
                      children: line_local,
                  });
                  lines.push({...nodeParagraphs});
                  nodeParagraphs.children = [];
                  line_local = ''
                  currentWidth = 0
                }
             }
             line_local += word 
             currentWidth += wordWidth;
             if (i === words.length - 1) {
              nodeParagraphs.children.push({
                type: "text",
                children: line_local.trim(),
              });
              lines.push({...nodeParagraphs});
              nodeParagraphs.children = [];
            }
         }); 

       
      }
     
    });
  
    return lines;
  }
  
  function getFontSize(element) {
    if (element && element.style && element.style["font-size"]) {
      return element.style["font-size"];
    }
    return "16px"; // Tamaño de fuente predeterminado
  }
  
  function getTextWidth(text, fontSize, containerWidth) {
    // Ancho promedio de caracteres basado en el tamaño del contenedor y el tamaño de fuente
    const averageCharWidth = (containerWidth / 105) * (fontSize / 16);
    return text.length * averageCharWidth;
  }


  interface LineContent {
    type: 'paragraph';
    line: number;
    children: Array<{ element: string; value: string }>;
  }
  
  interface LineContent {
    type: 'paragraph';
    line: number;
    children: Array<{ element: string; value: string }>;
  }
  
  export class LineBreaker {
    private htmlContent: string;
    private pageWidth: number;
    private defaultCharWidth: number = 7; // Ancho promedio de un carácter en píxeles
  
    constructor(htmlContent: string, pageWidth: number) {
      this.htmlContent = htmlContent;
      this.pageWidth = pageWidth;
    }
  
    // Función que calcula el ancho estimado del texto en píxeles
    private getTextWidth(text: string): number {
      return text.length * this.defaultCharWidth;
    }
  
    // Eliminar etiquetas HTML y procesar el texto
    private extractTextFromHtml(): string[] {
      const regex = /<[^>]*>(.*?)<\/[^>]*>/g;
      let match;
      const texts: string[] = [];
  
      // Reemplazamos las etiquetas HTML por nada y extraemos el texto
      match = this.htmlContent.replace(/<[^>]+>/g, match => {
        const text = match.replace(/<\/?[^>]+(>|$)/g, ""); // Eliminamos las etiquetas HTML
        if (text.trim()) {
          texts.push(text); // Almacenamos solo texto significativo
        }
        return '';
      });
  
      return texts;
    }
  
    public breakText(): LineContent[] {
      const lines: LineContent[] = [];
      let currentLine: { type: 'paragraph'; line: number; children: Array<{ element: string; value: string }> } = {
        type: 'paragraph',
        line: 1,
        children: []
      };
  
      let currentLineWidth = 0;
  
      // Extraemos el texto sin etiquetas HTML
      const texts = this.extractTextFromHtml();
  
      texts.forEach(text => {
        const textWidth = this.getTextWidth(text);
  
        // Si la línea excede el ancho de la página, agregamos la línea actual y empezamos una nueva
        if (currentLineWidth + textWidth > this.pageWidth) {
          lines.push(currentLine);
          currentLine = {
            type: 'paragraph',
            line: currentLine.line + 1,
            children: []
          };
          currentLineWidth = 0;
        }
  
        // Agregamos el texto a la línea actual
        currentLine.children.push({
          element: 'text',
          value: text
        });
        currentLineWidth += textWidth;
      });
  
      // Agregamos la última línea si tiene contenido
      if (currentLine.children.length > 0) {
        lines.push(currentLine);
      }
  
      return lines;
    }
  }
  

  