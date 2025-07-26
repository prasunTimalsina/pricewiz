import { Pool } from "pg"
import dotenv from "dotenv"
import fs from 'fs'
import path from "path"

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

function logToFile(message) {
    const logFile = path.resolve("server.txt")
    const timestamp = new Date().toISOString()
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`)
}

export async function UpdateListing() {
    console.time("schedule time")
    try {
        const res = await pool.query(`SELECT id,query FROM "Query"`)
        const queries = res.rows

        for (const q of queries) {
            console.time("loop time")
            const matchedListings = await ScrapeAndCompare(q.id, q.query)
            await UpdateDb(matchedListings)
            console.timeEnd("loop time")
        }
        console.timeEnd("schedule time")
        return queries
    } catch (err) {
        console.error("Error fetching query IDs:", err)
        throw err
    }
}


export async function ScrapeAndCompare(qid, query) {
    try {
        const listingRes = await pool.query(
            `
      SELECT l.title, l.platform, l.price 
      FROM "Listing" l
      JOIN "Product" p ON l."productId" = p.id
      JOIN "ProductQueries" pq ON pq."productId" = p.id
      WHERE pq."queryId" = $1
      `,
            [qid]
        )

        const listings = listingRes.rows
        logToFile(`listing Data:\n${JSON.stringify(listings, null, 2)}`)
        const scrapeStart = Date.now()

        const response = await fetch("http://localhost:3000/api/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const scrapedListing = await response.json()

        const scrapeEnd = Date.now()
        const scrapeDuration = ((scrapeEnd - scrapeStart) / 1000).toFixed(2)

        //logToFile(`Scrape time for query "${query}" (qid=${qid}): ${scrapeDuration}s`)
        //logToFile(`Scraped Data:\n${JSON.stringify(scrapedListing, null, 2)}`)

        const matchedListings = Compare(listings, scrapedListing)
        logToFile(`✅ Matched Listings:\n${JSON.stringify(matchedListings, null, 2)}`)

        return { matchedListings }
    } catch (err) {
        logToFile(`❌ Error in ScrapeAndCompare for query ID ${qid}: ${err.message}`)
        throw err
    }
}



function Compare(listings, scrapedListing) {
    const flatScraped = scrapedListing.flat()

    const matchedListings = flatScraped.filter(yItem => {
        const cleanedYTitle = cleanTitle(yItem.title)
        yItem.title = cleanedYTitle

        return listings.some(xItem => cleanTitle(xItem.title) === cleanedYTitle && xItem.platform == yItem.site)
    })
    return matchedListings
}


export async function UpdateDb(matchedListings) {
    for (const listing of matchedListings) {
        const { site, title, href, price } = listing

        try {
            const result = await pool.query(
                `SELECT id FROM "Listing" WHERE "platform" = $1 AND "title" = $2 AND "url" = $3 LIMIT 1`,
                [site, title, href]
            )

            if (result.rows.length > 0) {
                const id = result.rows[0].id
                const rows = result.rows[0]
                console.log(`matched row:`, rows)
                await pool.query(
                    `UPDATE listing SET price = $1 WHERE id = $2`,
                    [price, id]
                )

                console.log(`✅ Updated price for: ${title} (${site})`)
            } else {
                console.log(`❌ No match found in DB for: ${title} (${site})`)
            }
        } catch (err) {
            console.error(`⚠️ Error updating ${title} (${site}):`, err)
        }
    }
}

function cleanTitle(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return ""

    const cleaned = raw
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[/\\|_-]+/g, " ")
        .replace(
            /\b(?:evostore|oliz store|official store|authorized reseller|apple intelligence|store)\b/g,
            ""
        )
        .replace(
            /\b\d+(\.\d+)?\s?(?:gb|tb|mb|kb|ram|ssd|m?ah|w|kw|v|hz|inch|in|cm|mm|kg|g|ml|l|oz)\b/g,
            ""
        )
        .replace(/\b\d+(\.\d+)?\s?(?:ml|l|oz)\b/g, "")
        .replace(
            /\b(?:new|latest|sale|edition|limited|original|genuine|authentic)\b/g,
            ""
        )
        .replace(/[^a-z0-9\s."]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()

    const words = cleaned.split(/\s+/).filter(Boolean)
    return words.slice(0, 5).join(" ")
}




