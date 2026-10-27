import type { RootState } from "@/application/store/hooks";

export const selectPromotions = (state: RootState) =>
  state.products.items.filter(
    (product) => product.discount !== undefined && product.discount > 0
  );

export const selectNewArrivals = (state: RootState) =>
  state.products.items
    .filter((product) => Boolean(product.createdAt))
    .slice()
    .sort(
      (first, second) =>
        new Date(second.createdAt ?? 0).getTime() -
        new Date(first.createdAt ?? 0).getTime()
    );
