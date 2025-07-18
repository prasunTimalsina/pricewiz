/**
 * @typedef {Object} Product
 * @property {string} site
 * @property {string} href
 * @property {string} img
 * @property {string} title
 * @property {string} price
 */

/**
 * @param {Product[]} products
 * @returns {Product[]}
 */
export default function SelectTop10(products) {
  const topPerSite = {
    daraz: [],
    itti: [],
    hukut: [],
  };

  const used = new Set();

  for (const product of products) {
    const site = product.site.toLowerCase();
    if (topPerSite[site] && topPerSite[site].length < 2) {
      topPerSite[site].push(product);
      used.add(product);
    }
  }

  const top6 = [...topPerSite.daraz, ...topPerSite.itti, ...topPerSite.hukut];

  //TODO:replace this price logic in proper file
  const numericPrices = products.map((p) =>
    parseInt(p.price.replace(/\D/g, ""), 10)
  );
  const avgPrice = Math.round(
    numericPrices.reduce((a, b) => a + b, 0) / numericPrices.length
  );

  const remaining = products.filter((p) => !used.has(p));

  const closestToAvg = remaining
    .map((p) => ({
      product: p,
      diff: Math.abs(parseInt(p.price.replace(/\D/g, ""), 10) - avgPrice),
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 4)
    .map((entry) => entry.product);

  let top10selected = [...top6, ...closestToAvg];

  if (top10selected.length < 10) {
    const selectedSet = new Set(top10selected);
    for (const product of products) {
      if (top10selected.length >= 10) break;
      if (!selectedSet.has(product)) {
        top10selected.push(product);
        selectedSet.add(product);
      }
    }
  }

  return top10selected;
}
