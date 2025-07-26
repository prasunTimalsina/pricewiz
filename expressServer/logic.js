import { Pool } from "pg"
import dotenv from "dotenv"
import fs from 'fs'
import path from "path"

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function UpdateListing() {
    console.time("schedule time")
    try {
        const res = await pool.query(`SELECT id,query FROM "Query"`)
        const queries = res.rows

        for (const q of queries) {
            console.time("loop time")
            await ScrapeAndCompare(q.id, q.query)
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
        logToFile(`Scraped Data:\n${JSON.stringify(scrapedListing, null, 2)}`)

        const matchedListings = Compare(listings, scrapedListing)
        logToFile(`✅ Matched Listings:\n${JSON.stringify(matchedListings, null, 2)}`)

        return { listings, scrapedListing }
    } catch (err) {
        logToFile(`❌ Error in ScrapeAndCompare for query ID ${qid}: ${err.message}`)
        throw err
    }
}


// Logging helper
function logToFile(message) {
    const logFile = path.resolve("server.txt")
    const timestamp = new Date().toISOString()
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`)
}

function Compare(listings, scrapedListing) {
    const matchedListings = scrapedListing.filter(yItem => {
        return listings.some(xItem => xItem.title === yItem.title)
    })
    return matchedListings
}

