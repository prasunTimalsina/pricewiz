import puppeteer from 'puppeteer';

export async function scrapeIiti(Iurl) {
  const browser = await puppeteer.launch({
    headless: false, 
    args: ['--start-maximized', '--window-size=1920,1080'],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(Iurl, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  });

  await page.waitForSelector('.product-grid-layout', { timeout: 30000 });

  const products = await parse(page);

  await browser.close();
  return products;
}

async function parse(page) {
  const products = await page.evaluate(() => {
    const container = document.querySelector('.product-grid-layout');
    if (!container) return [];

    const items = container.querySelectorAll('.flex.flex-col.items-center.flex-1');
    return Array.from(items).map(item => {
      // Select the <a> tag that has title and href
      const anchor = item.querySelector('.relative.flex-1.w-full a');
      const title = anchor?.getAttribute('aria-label') || null;
      const href = anchor?.href || null;

      // Extract the raw image URL from the /_next/image?url=... format
      const rawImgSrc = anchor?.querySelector('.flex.justify-center.w-full.img-aspect-ratio img')?.src || '';
      const img = rawImgSrc.includes('url=') ? decodeURIComponent(rawImgSrc.split('url=')[1].split('&')[0]) : null;

      // Get price text from nested structure
      const priceContainer = item.querySelector('.w-full.mt-1 .flex.flex-col-reverse.mt-1.md\\:flex-col.md\\:mt-0 .flex.mt-0.gap-\\[5px\\].gap-y-0.h-\\[50px\\].md\\:h-\\[56px\\].w-full.flex-col.justify-end p');
      const price = priceContainer?.innerText || null;

      return {
        site: 'IITI',
        title,
        price,
        href,
        img
      };
    });
  });

  return products;
}

