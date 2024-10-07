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

          words.forEach((word) => {
             const wordWidth = getTextWidth(word, fontSize, containerWidth);
             const cu = Number(currentWidth) + Number(wordWidth);
             if (cu > containerWidth) {
                 // Si agregar la palabra excede el ancho, cerramos la línea actual
                 if (line_local.trim().length > 0) {
                        nodeParagraphs.children.push({
                            type: "text",
                            children: line_local,
                        });
                        lines.push({...nodeParagraphs});
                        nodeParagraphs.children = [];
                 }
                 line_local = word
                 currentWidth = wordWidth; 
             } else {
                 line_local += word 
                 currentWidth += wordWidth; 
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