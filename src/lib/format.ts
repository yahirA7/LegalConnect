const MXN_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatMXN(amount: number): string {
  return MXN_FORMAT.format(amount);
}

export function formatPricePerHour(amount: number): string {
  return `${formatMXN(amount)}/h`;
}
