// src/app/shared/utils/box-util.ts

export function extractCategoryAndNumber(boxGUID: string): [string, number] {
    const match = boxGUID.match(/^([A-Z]+)-(\d+)/);
    if (match) {
      const category = match[1];
      const number = parseInt(match[2], 10);
      return [category, number];
    }
    return ['', 0];
  }
  