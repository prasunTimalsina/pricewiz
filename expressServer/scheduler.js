import cron from "node-cron"
import { getTimestamp } from "./db.js"

const task = cron.schedule(
    "* * * * *",
    async () => {
        try {
            const timestamp = await getTimestamp()
            console.log(`✅ Automated run at DB timestamp: ${timestamp}`)
            try {
                const products = await UpdateListing()
                console.log(products)
            } catch (err) {
                console.log("failed to run update listing", err)
            }
        } catch (err) {
            console.error("❌ Error fetching timestamp:", err.message)
        }
    },
    {
        scheduled: false,
    }
)

task.start();

