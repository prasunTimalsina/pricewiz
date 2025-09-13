import puppeteer from "puppeteer";

export async function ScrapeHukut(HUurl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-maximized", "--window-size=1920,1080"],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto(HUurl, {
      waitUntil: "networkidle2",
      timeout: 100000,
    });

    const emptyResults = await page.$(
      "body > section > div.w-full.exlg\\:w-\\[80\\%\\] > div.flex.flex-col.items-center.justify-center.w-full.py-\\[36px\\] > img[alt='Empty Search Results']"
    );
    if (emptyResults) {
      await browser.close();
      return [];
    }

    await page.waitForSelector(
      "body > section > div.w-full.exlg\\:w-\\[80\\%\\] > div.grid.grid-cols-2.md\\:grid-cols-4.lg\\:grid-cols-5.gap-\\[16px\\].my-\\[16px\\]",
      { timeout: 30000 }
    );

    const products = await parse(page);

    await browser.close();
    return products.slice(0, 5);
  } catch (err) {
    console.error("Scraping failed:", err.message);
    await browser.close();
    return [];
  }
}

async function parse(page) {
  try {
    const products = await page.evaluate(() => {
      const container = document.querySelector(
        "body > section > div.w-full.exlg\\:w-\\[80\\%\\] > div.grid.grid-cols-2.md\\:grid-cols-4.lg\\:grid-cols-5.gap-\\[16px\\].my-\\[16px\\]"
      );
      if (!container) return [];

      const items = container.querySelectorAll("div");
      const data = [];

      items.forEach((item) => {
        try {
          const anchor = item.querySelector("a");
          if (!anchor) return;

          const href = anchor.getAttribute("href")
            ? "https://hukut.com" + anchor.getAttribute("href")
            : null;

          const titleTag = anchor.querySelector("p");
          const title = titleTag?.innerText?.trim() || null;

          const priceTag = anchor.querySelector(
            "div.flex.flex-col.flex-1.w-full.min-w-0 > p"
          );
          let price = priceTag?.innerText || null;
          if (price && price.startsWith("Rs.")) {
            price = price.replace("Rs.", "").replace(/,/g, "").trim();
          }

          const imgTag = anchor.querySelector(
            "div.relative.h-\\[152px\\].md\\:h-\\[176px\\].w-full.mb-\\[8px\\].rounded-md.bg-\\[\\#F7F7F7\\] > img"
          );
          const img = imgTag?.getAttribute("src") || null;

          if (href && img && title && price) {
            data.push({
              site: "Hukut",
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
    console.error("Parse failed:", err.message);
    return [];
  }
}

export default ScrapeHukut;
