
export function extractCategoryAndNumber(boxGUID: string): [string, number] {
    const match = boxGUID.match(/^([A-Z]+)-(\d+)/);
    if (match) {
      const category = match[1];
      const number = parseInt(match[2], 10);
      console.log('function extractCategoryAndNumber is working:', category, number);
      return [category, number];
    }
    return ['', 0];
  }
  