export function formatPrice(price: string | number, currency = "AED"): string {
  const value = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(value)) return String(price);

  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(sqft: number): string {
  return `${new Intl.NumberFormat("en-US").format(sqft)} sq.ft`;
}

export function statusLabel(status: string): string {
  return status === "rent" ? "For Rent" : "For Sale";
}

export function typeLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
