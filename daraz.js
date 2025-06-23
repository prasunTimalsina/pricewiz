import puppeteer from 'puppeteer';
import fs from 'fs';
export async function scrapeDaraz(Durl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--start-maximized', '--window-size=1920,1080'],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(Durl, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  });

  await page.waitForSelector('._17mcb', { timeout: 30000 });
  await autoScroll(page);

  const products = await parse(page);

  await browser.close();
  return products;
}

async function parse(page) {
  const products = await page.evaluate(() => {
    const container = document.querySelector('._17mcb');
    if (!container) return [];

    const items = container.querySelectorAll('.Bm3ON');
    const data = [];

    items.forEach(item => {
      try {
        const imageContainer = item.querySelector('.Ms6aG .qmXQo .ICdUp ._95X4G a');
        const href = imageContainer?.href || null;

        const imgTag = imageContainer?.querySelector('img');
        const img =
          imgTag?.getAttribute('data-src') ||
          imgTag?.getAttribute('src') ||
          null;

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
      } catch (_) {
        // Ignore parsing error
      }
    });
    return data;
  });

  const lines = products.map((item, i) => (
    `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nPrice: ${item.price}\nImage: ${item.img}\nLink: ${item.href}\n`
  )).join('\n');

  fs.writeFileSync('daraz.txt', lines, 'utf-8');

  return products;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => { let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
