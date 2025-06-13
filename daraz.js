import puppeteer from 'puppeteer';

export async function scrapeDaraz(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  });

  await page.waitForSelector('._17mcb', { timeout: 30000 });

  const products = await page.evaluate(() => {
    const container = document.querySelector('._17mcb');
    if (!container) return [];

    const items = container.querySelectorAll('.Bm3ON');
    const data = [];

    items.forEach(item => {
      try {
        const imageContainer = item.querySelector('.Ms6aG .qmXQo .ICdUp ._95X4G a');
        const href = imageContainer?.href || null;
        const img = imageContainer?.querySelector('img')?.src || null;

        const infoContainer = item.querySelector('.Ms6aG .qmXQo .buTCk');
        const title = infoContainer?.querySelector('.buTCk a')?.innerText || null;
        const price = infoContainer?.querySelector('.aBrP0 .ooOxS')?.innerText || null;

        if (href && img && title && price) {
          data.push({
            site: 'Daraz',
            href,
            img,
            title,
            price,
          });
        }
      } catch (err) {
      }
    });

    return data;
  });

  await browser.close();
  return products;
}

