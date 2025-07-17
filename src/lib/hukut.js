import puppeteer from 'puppeteer'
import fs from 'fs'

export async function ScrapeHukut(HUurl) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized', '--window-size=1920,1080'],
    defaultViewport: null,
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  await page.goto(HUurl, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  })

  await page.waitForSelector(
    'body > section > div > div > div.w-full.md\\:10\\/12.px-16.md\\:px-6.lg\\:w-3\\/4.py-\\[15px\\].filteredproducts > div > section > div.flex.relative > div.flex.flex-wrap.w-full',
    { timeout: 30000 }
  )

  await autoScroll(page)

  const products = await parse(page)

  await browser.close()
  return products
}

async function parse(page) {
  const products = await page.evaluate(() => {
    const container = document.querySelector(
      'body > section > div > div > div.w-full.md\\:10\\/12.px-16.md\\:px-6.lg\\:w-3\\/4.py-\\[15px\\].filteredproducts > div > section > div.flex.relative > div.flex.flex-wrap.w-full'
    )
    if (!container) return []

    const items = container.querySelectorAll('div > div > div.flex-1.flex.flex-col.h-full')
    const data = []

    items.forEach((item) => {
      try {
        const imgTag = item.querySelector(
          'div.relative.flex.justify-center.pt-6.mb-6.relative.w-full.h-\\[150px\\].md\\:h-\\[210px\\] img'
        )
        let img = imgTag?.getAttribute('src') || null

        if (img && img.startsWith('/_next/image?url=')) {
          const urlPart = img.split('url=')[1]?.split('&')[0] || ''
          img = decodeURIComponent(urlPart)
        }


        const hrefTag = item.querySelector(
          'div.relative.flex.justify-center.pt-6.mb-6.relative.w-full.h-\\[150px\\].md\\:h-\\[210px\\] a'
        )
        const href = hrefTag?.getAttribute('href')
          ? 'https://hukut.com' + hrefTag.getAttribute('href')
          : null

        const titleTag = item.querySelector('div.flex-1.flex.flex-col > h4 > a > p')
        const title = titleTag?.innerText || null

        const priceTag = item.querySelector(
          'div.flex-1.flex.flex-col > div.flex.flex-wrap.font-semibold.text-tiny.xs\\:text-base.md\\:text-\\[22px\\].my-12.dark\\:text-white.listview\\:d-none'
        )
        let price = priceTag?.innerText || null
        if (price) {
          price = price.replace(/रु|,/g, '').trim().split('\n')[0].trim()
        }

        if (href && img && title && price) {
          data.push({
            site: 'Hukut',
            href,
            img,
            title,
            price,
          })
        }
      } catch (_) {
        // Skip item if any parsing issue occurs
      }
    })

    return data
  })

  //fs.writeFileSync('hukut.json', JSON.stringify(products, null, 2), 'utf-8')

  return products
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0
      const distance = 400
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 200)
    })
  })
}

export default ScrapeHukut



