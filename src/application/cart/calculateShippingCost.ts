export const calculateShippingCost = (total: number): number => {
  if (total >= 20_000) return 0;
  if (total >= 10_000) return 500;
  return 1_000;
};
