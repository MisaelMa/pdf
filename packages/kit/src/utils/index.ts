export function colorToRGB(color: string): string {
    // Convertir el color a formato RGB para PDF
    // Ejemplo de conversión simple para este caso
    if (color === 'black') return '0 0 0';
    if (color === 'red') return '1 0 0';
    // Manejar otros colores o hexadecimales
    return '0 0 0'; // Por defecto negro
  }
  
  export function fontToPDF(fontSize: string, fontFamily: string, fontWeight: string, fontStyle: string) {
    // Convertir las propiedades de texto a formato PDF
    const fontString = `${fontFamily}-${fontWeight}-${fontStyle}`;
    return { fontString, fontSize };
  }
  