import { Pool } from "pg"
import dotenv from "dotenv"

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


async function ScrapeAndCompare(qid, query) {
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

        console.time("srape time")
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
        console.timeEnd("srape time")

        console.log(`scraped data:`, scrapedListing)
        const matchedListings = Compare(listings, scrapedListing)
        console.log(`matched items`, matchedListings)

        return { listings, scrapedListing }
    } catch (err) {
        console.error(` Error in ScrapeAndCompare for query ID ${qid}:`, err)
        throw err
    }
}

function Compare(listings, scrapedListing) {
    const matchedListings = scrapedListing.filter(yItem => {
        return listings.some(xItem =>
            xItem.title === yItem.title && xItem.platform === yItem.site
        )
    })

    return matchedListings
}
