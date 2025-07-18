import puppeteer from 'puppeteer'

export async function scrapeHamrobazaar(Hurl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--start-maximized', '--window-size=1920,1080'],
    defaultViewport: false,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  await page.goto(`${Hurl}`, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  })
  const wrapperExists = await page.waitForSelector('[data-test-id="virtuoso-item-list"]', { timeout: 30000 })
  const seenHrefs = new Set()
  const collectedItems = []
  const maxItems = 40

  if (!wrapperExists) {
    await browser.close()
    return []
  }


  let lastHeight = 0
  let idleCounter = 0
  const maxIdle = 5

  while (idleCounter < maxIdle && collectedItems.length < maxItems) {
    const newItems = await page.evaluate(() => {
      const container = document.querySelector('[data-test-id="virtuoso-item-list"]')
      if (!container) return []

      const nodes = container.querySelectorAll('[data-index]')
      return Array.from(nodes).map(node => {
        const card = node.querySelector('.card-product-linear')

        const imgContainer = card?.querySelector('.card-product-linear-imgContainer')
        const aTagImg = imgContainer?.querySelector('a')
        const href = aTagImg?.href || null
        const img = aTagImg?.querySelector('.image-container img')
        const imgSrc = img?.src || null

        const info = card?.querySelector('.card-product-linear-info')
        const nameAndDropdown = info?.querySelector('.nameAndDropdown a')
        const title = nameAndDropdown?.querySelector('h2.product-title')?.innerText || null

        const description = info?.querySelector('p.description')?.innerText || null

        const priceContainer = info?.querySelector('.priceAndCondition .productPrice.productPrice-liner')
        const rawPrice = priceContainer?.querySelector('span.regularPrice')?.innerText || null
        const price = rawPrice ? rawPrice.replace(/[^\d]/g, '') : null

        return {
          site: "Hmaro_Bazar",
          href,
          img: imgSrc,
          title,
          description,
          price,
        }
      })
    })

    let addedNew = false
    for (const item of newItems) {
      if (item.href && !seenHrefs.has(item.href)) {
        seenHrefs.add(item.href)
        collectedItems.push(item)
        addedNew = true
        if (collectedItems.length >= maxItems) break
      }
    }

    if (!addedNew) {
      idleCounter++
    } else {
      idleCounter = 0
    }

    await page.evaluate(() => window.scrollBy(0, window.innerHeight))
    await new Promise(res => setTimeout(res, 1000))

    const currentHeight = await page.evaluate(() => document.body.scrollHeight)
    if (currentHeight === lastHeight) idleCounter++
    else lastHeight = currentHeight
  }

  await browser.close()
  return collectedItems
}



export async function scrapeHamrobazaarPrice(Hurl, lowPrice, highPrice) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized', '--window-size=1920,1080'],
    defaultViewport: null,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  await page.goto(Hurl, {
    waitUntil: 'networkidle2',
    timeout: 100000,
  })

  await page.waitForSelector('.filter--form.show', { timeout: 30000 })

  await page.type('input[placeholder="Min"]', String(lowPrice), { delay: 100 })
  await page.type('input[placeholder="Max"]', String(highPrice), { delay: 100 })

  await page.evaluate(() => {
    const btn = document.querySelector('.form-item.form-item--filterBtn .btn')
    if (btn) btn.click()
  })

  await page.waitForSelector('[data-test-id="virtuoso-item-list"]', { timeout: 30000 })

  const seenHrefs = new Set()
  const collectedItems = []
  const maxItems = 40

  let lastHeight = 0
  let idleCounter = 0
  const maxIdle = 5

  while (idleCounter < maxIdle && collectedItems.length < maxItems) {
    const newItems = await page.evaluate(() => {
      const container = document.querySelector('[data-test-id="virtuoso-item-list"]')
      if (!container) return []

      const nodes = container.querySelectorAll('[data-index]')
      return Array.from(nodes).map(node => {
        const card = node.querySelector('.card-product-linear')
        const imgContainer = card?.querySelector('.card-product-linear-imgContainer')
        const aTagImg = imgContainer?.querySelector('a')
        const href = aTagImg?.href || null
        const img = aTagImg?.querySelector('.image-container img')
        const imgSrc = img?.src || null

        const info = card?.querySelector('.card-product-linear-info')
        const nameAndDropdown = info?.querySelector('.nameAndDropdown a')
        const title = nameAndDropdown?.querySelector('h2.product-title')?.innerText || null
        const description = info?.querySelector('p.description')?.innerText || null
        const priceContainer = info?.querySelector('.priceAndCondition .productPrice.productPrice-liner')
        const rawPrice = priceContainer?.querySelector('span.regularPrice')?.innerText || null
        const price = rawPrice ? rawPrice.replace(/[^\d]/g, '') : null
        return {
          site: "Hmaro_Bazar",
          href,
          img: imgSrc,
          title,
          description,
          price,
        }
      })
    })

    let addedNew = false
    for (const item of newItems) {
      if (item.href && !seenHrefs.has(item.href)) {
        seenHrefs.add(item.href)
        collectedItems.push(item)
        addedNew = true
        if (collectedItems.length >= maxItems) break
      }
    }

    if (!addedNew) {
      idleCounter++
    } else {
      idleCounter = 0
    }

    await page.evaluate(() => window.scrollBy(0, window.innerHeight))
    await new Promise(res => setTimeout(res, 1000))

    const currentHeight = await page.evaluate(() => document.body.scrollHeight)
    if (currentHeight === lastHeight) idleCounter++
    else lastHeight = currentHeight
  }

  await browser.close()
  return collectedItems
}


