export const REDUCED_SHIPPING_THRESHOLD = 10_000;
export const FREE_SHIPPING_THRESHOLD = 20_000;
export const REDUCED_SHIPPING_COST = 500;
export const STANDARD_SHIPPING_COST = 1_000;

export const calculateShippingCost = (subtotalXof: number): number => {
  if (!Number.isSafeInteger(subtotalXof) || subtotalXof < 0) return 0;
  if (subtotalXof >= FREE_SHIPPING_THRESHOLD) return 0;
  if (subtotalXof >= REDUCED_SHIPPING_THRESHOLD) {
    return REDUCED_SHIPPING_COST;
  }
  return STANDARD_SHIPPING_COST;
};
