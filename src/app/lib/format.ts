const currencyFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}
