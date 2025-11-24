import puppeteer from "puppeteer";

export async function scrapeDaraz(Durl) {
  //launching puppeteer with headless browser and given size 
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-maximized", "--window-size=1920,1080"],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  //sending scrape url 
  try {
    await page.goto(Durl, {
      waitUntil: "networkidle2",
      timeout: 1000,
    });

    //waiting for page which has scrape items 
    await page.waitForSelector("._17mcb", { timeout: 30000 });

    //implementation of autoScroll for scaning whole page 
    await autoScroll(page);

    //giving the scraped page to html parser 
    const products = await parse(page);

    await browser.close();
    return products;
  } catch (err) {
    console.error("Daraz scraping failed:", err.message);
    await browser.close();
    return [];
  }
}

async function parse(page) {
  try {
    const products = await page.evaluate(() => {
      //selecting container with all the needed items
      const container = document.querySelector("._17mcb");
      if (!container) return [];

      const items = container.querySelectorAll(".Bm3ON");
      const data = [];

      //looping over items to takeout image , url , title , price
      items.forEach((item) => {
        try {
         
          const imageContainer = item.querySelector(
            ".Ms6aG .qmXQo .ICdUp ._95X4G a"
          );
          const href = imageContainer?.href || null;

          //image
          const imgTag = imageContainer?.querySelector("img");
          const img =
            imgTag?.getAttribute("data-src") ||
            imgTag?.getAttribute("src") ||
            null;

          const infoContainer = item.querySelector(".Ms6aG .qmXQo .buTCk");

          //title
          const title =
            infoContainer?.querySelector(".buTCk a")?.innerText?.trim() || null;
          const rawPrice =
            infoContainer?.querySelector(".aBrP0 .ooOxS")?.innerText || null;
          //price
          const price = rawPrice ? rawPrice.replace(/[^\d]/g, "").trim() : null;

          if (href && img && title && price) {
            data.push({
              site: "Daraz",
              href,
              img,
              title,
              price,
            });
          }
        } catch (_) {}
      });
      return data;
    });

    return products;
  } catch (err) {
    console.error("Daraz parse failed:", err.message);
    return [];
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
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
export default scrapeDaraz;
