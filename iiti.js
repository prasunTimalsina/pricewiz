import puppeteer from 'puppeteer';


export async function scrapeIiti(Iurl) {
   const browser = await puppeteer.launch({
    headless: true,
    args: ['--start-maximized', '--window-size=1920,1080'], 
    defaultViewport: null, 
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 }); 

  await page.goto(
    `${Durl}`,
    {
      waitUntil: 'networkidle2',
      timeout: 100000,
    }
  );

  await page.waitForSelector('', { timeout: 30000 });
  await autoScroll(page);

  parse(page)
}

function parse() {
}
