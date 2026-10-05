export type PaddleCatalogProduct = {
  id: string;
  name: string;
};

export function normalizePaddleName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function findPaddleProduct(products: PaddleCatalogProduct[], title: string, slug?: string | null) {
  const names = new Set([normalizePaddleName(title), normalizePaddleName(slug ?? "")].filter(Boolean));
  return products.find((product) => names.has(normalizePaddleName(product.name)));
}

export function paddleUnitPrice(priceCents: number, currency: string) {
  return {
    unit_price: {
      amount: String(Math.max(0, Math.round(priceCents))),
      currency_code: currency.trim().toUpperCase(),
    },
  };
}