export const REDUCED_SHIPPING_THRESHOLD = 10_000;
export const FREE_SHIPPING_THRESHOLD = 20_000;
export const REDUCED_SHIPPING_COST = 500;
export const STANDARD_SHIPPING_COST = 1_000;

export const calculateShippingCost = (total: number): number => {
  if (!Number.isFinite(total) || total < 0) return 0;
  if (total >= FREE_SHIPPING_THRESHOLD) return 0;
  if (total >= REDUCED_SHIPPING_THRESHOLD) return REDUCED_SHIPPING_COST;
  return STANDARD_SHIPPING_COST;
};
