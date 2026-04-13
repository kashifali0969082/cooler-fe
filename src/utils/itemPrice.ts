/** Unit price charged at checkout (sale price when a valid discount is set). */
export function itemEffectiveUnitPrice(item: {
  price: number;
  discountedPrice?: number | null;
}): number {
  const p = Number(item.price);
  const d = item.discountedPrice != null ? Number(item.discountedPrice) : NaN;
  if (Number.isFinite(d) && d > 0 && d < p) {
    return d;
  }
  return p;
}

export function itemHasDiscount(item: {
  price: number;
  discountedPrice?: number | null;
}): boolean {
  const p = Number(item.price);
  const d = item.discountedPrice != null ? Number(item.discountedPrice) : NaN;
  return Number.isFinite(d) && d > 0 && d < p;
}
