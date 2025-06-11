import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://hamrobazaar.com/search/product?q=fan', {
    waitUntil: 'networkidle2',
    timeout: 100000,
  });

  // Wait for the main container to load
  await page.waitForSelector('[data-test-id="virtuoso-item-list"]', { timeout: 30000 });
//await page.waitForSelector('.card-product-linear-imgContainer', { timeout: 30000 });

  const seenIndexes = new Set();

  let lastHeight = 0;
  let idleCounter = 0;
  const maxIdle = 5; // Exit after 5 scrolls with no new data

  while (idleCounter < maxIdle) {
    const newItems = await page.evaluate(() => {
      const container = document.querySelector('[data-test-id="virtuoso-item-list"]');
      if (!container) return [];

      const nodes = container.querySelectorAll('[data-index]');
      return Array.from(nodes).map(node => ({
        index: parseInt(node.getAttribute('data-index')),
        html: node.outerHTML,
      }));
    });

    let addedNew = false;
    for (const item of newItems) {
      if (!seenIndexes.has(item.index)) {
        seenIndexes.add(item.index);
        console.log(`Added index ${item.index}`);
        console.log(`${item.html}`);
        // Optionally push to a final array
      }
    }

    if (!addedNew && seenIndexes.size === newItems.length) {
      idleCounter++;
    } else {
      idleCounter = 0;
    }

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight); // Scroll down
    });

    await new Promise(res => setTimeout(res, 1000)); // Wait for lazy loading

    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === lastHeight) idleCounter++;
    else lastHeight = currentHeight;
  }

  console.log(`Total items collected: ${seenIndexes.size}`);

  await browser.close();
})();

