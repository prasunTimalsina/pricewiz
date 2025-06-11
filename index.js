import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  //const query = "bike"
  //await page.goto(`https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`, {
  
  //await page.goto(`https://hamrobazaar.com/search/product?q=bike&Latitude=0&Longitude=0`, {
  //  waitUntil: 'load', timeout: 1000000
  //});

  await page.goto("https://jeevee.com/products/search?query=sunscreen", {
    waitUntil: 'load', timeout: 1000000
  });

  const html = await page.content();
  console.log(html);

  await browser.close();
})();

