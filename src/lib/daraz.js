// /lib/daraz.js
import puppeteer from "puppeteer";

export async function scrapeDaraz(Durl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-maximized", "--window-size=1920,1080"],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(Durl, {
    waitUntil: "networkidle2",
    timeout: 100000,
  });

  await page.waitForSelector("._17mcb", { timeout: 30000 });
  await autoScroll(page);

  const products = await parse(page);

  await browser.close();
  return products;
}

async function parse(page) {
  const products = await page.evaluate(() => {
    const container = document.querySelector("._17mcb");
    if (!container) return [];

    const items = container.querySelectorAll(".Bm3ON");
    const data = [];

    items.forEach((item) => {
      try {
        const imageContainer = item.querySelector(
          ".Ms6aG .qmXQo .ICdUp ._95X4G a"
        );
        const url = imageContainer?.href || null;

        const imgTag = imageContainer?.querySelector("img");
        const imageUrl =
          imgTag?.getAttribute("data-src") ||
          imgTag?.getAttribute("src") ||
          null;

        const infoContainer = item.querySelector(".Ms6aG .qmXQo .buTCk");
        const title =
          infoContainer?.querySelector(".buTCk a")?.innerText || null;
        const rawPrice =
          infoContainer?.querySelector(".aBrP0 .ooOxS")?.innerText || null;
        const price = rawPrice
          ? parseFloat(rawPrice.replace(/[^\d]/g, ""))
          : null;

        if (url && imageUrl && title && !isNaN(price)) {
          data.push({
            platform: "Daraz",
            url,
            imageUrl,
            title,
            price,
          });
        }
      } catch (_) {}
    });
    return data;
  });

  return products;
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
