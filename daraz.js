
import puppeteer from 'puppeteer';

export async function scrapeDaraz(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  });

  await page.waitForSelector('._17mcb', { timeout: 30000 });

   const html = await page.content();
  console.log(html);

  await browser.close();
}
