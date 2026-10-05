// src/utils/responsive.ts
export const clamp = (min: number, preferred: number, max: number): number => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 768) return min;
    if (width > 1200) return max;
    return preferred;
  }
  return preferred;
};