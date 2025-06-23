
import puppeteer from 'puppeteer';
import fs from 'fs';

xport async function scrapeFoodMandu(Furl) {
  const browser = await puppeteer.launch({
    headless: true, 
    args: ['--start-maximized', '--window-size=1920,1080'],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(Iurl, {
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
