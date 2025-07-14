
import puppeteer from 'puppeteer';
import fs from 'fs';

export async function scrapeFoodMandu(Furl) {
  const browser = await puppeteer.launch({
    headless: true, 
    args: ['--start-maximized', '--window-size=1920,1080'],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(Furl, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  });

  await page.waitForSelector('.row.wrapper-listing.ng-isolate-scope', { timeout: 30000 });
  await autoScroll(page);

  const products = await parse(page);

  await browser.close();
  return products;
}

async function parse(page) {
    const products = await page.evaluate(() => {
    const baseUrl = 'https://foodmandu.com/';
    const items = document.querySelectorAll('.col-md-4.col-lg-4.spinner.ng-scope');
    return Array.from(items).map(item => {
      const link = item.querySelector('.listing__photo a')?.getAttribute('href') || null;
      const href = link ? baseUrl + link : null;

      const img = item.querySelector('.listing__photo a figure img')?.src || null;

      const title = item.querySelector('.title20.mt-2 a')?.innerText || null;

      const location = item.querySelector('.subtitle > div:nth-child(1) > span:nth-child(2)')?.innerText || null;

      const description = item.querySelector('.subtitle > div:nth-child(2) > span.ng-binding')?.innerText || null;

      return {
        site: 'Foodmandu',
        title,
        href,
        img,
        location,
        description
      };
    });
  });

  // Write to foodmandu.txt
  const lines = products.map((item, i) => (
    `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nLocation: ${item.location}\nDescription: ${item.description}\nImage: ${item.img}\nLink: ${item.href}\n`
  )).join('\n');

  fs.writeFileSync('foodmandu.txt', lines, 'utf-8');

  return products;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
