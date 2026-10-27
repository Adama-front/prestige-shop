const xofFormatter = new Intl.NumberFormat("fr-CI", {
  maximumFractionDigits: 0
});

export const formatXof = (amount: number): string =>
  `${xofFormatter.format(Math.round(amount))} FCFA`;
