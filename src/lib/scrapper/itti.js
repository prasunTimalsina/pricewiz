import puppeteer from "puppeteer";

export async function scrapeIiti(Iurl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-maximized", "--window-size=1920,1080"],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto(Iurl, {
      waitUntil: "networkidle2",
      timeout: 100000,
    });

    const wrapperExists = await page.$(".product-grid-layout");
    if (!wrapperExists) {
      await browser.close();
      return [];
    }

    await autoScroll(page);
    const products = await parse(page);

    await browser.close();
    return products.slice(0, 5);
  } catch (err) {
    console.error("IITI scraping failed:", err.message);
    await browser.close();
    return [];
  }
}

async function parse(page) {
  try {
    const products = await page.evaluate(() => {
      const container = document.querySelector(".product-grid-layout");
      if (!container) return [];

      const items = container.querySelectorAll(
        ".flex.flex-col.items-center.flex-1"
      );
      const data = [];

      items.forEach((item) => {
        try {
          const anchor = item.querySelector(".relative.flex-1.w-full a");
          const title = anchor?.getAttribute("aria-label") || null;
          const href = anchor?.href || null;

          const rawImgSrc =
            anchor?.querySelector(
              ".flex.justify-center.w-full.img-aspect-ratio img"
            )?.src || "";
          const img = rawImgSrc.includes("url=")
            ? decodeURIComponent(rawImgSrc.split("url=")[1].split("&")[0])
            : rawImgSrc || null;

          const priceContainer = item.querySelector(
            ".w-full.mt-1 .flex.flex-col-reverse.mt-1.md\\:flex-col.md\\:mt-0 .flex.mt-0.gap-\\[5px\\].gap-y-0.h-\\[50px\\].md\\:h-\\[56px\\].w-full.flex-col.justify-end p"
          );
          let price = priceContainer?.innerText || null;
          if (price) {
            price = price.replace(/रु|,/g, "").trim();
          }

          if (title && href && img && price) {
            data.push({
              site: "IITI",
              title,
              price,
              href,
              img,
            });
          }
        } catch (_) {}
      });

      return data;
    });

    return products;
  } catch (err) {
    console.error("IITI parse failed:", err.message);
    return [];
  }
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

export default scrapeIiti;
