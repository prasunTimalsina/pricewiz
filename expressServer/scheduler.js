import cron from "node-cron"
import { getTimestamp } from "./db.js"

const task = cron.schedule(
    "* * * * *",
    async () => {
        try {
            //const timestamp = await getTimestamp()
            //console.log(`✅ Automated run at DB timestamp: ${timestamp}`)
            console.log(`✅ Automated run at DB timestamp: without async`)
        } catch (err) {
            console.error("❌ Error fetching timestamp:", err.message)
        }
    },
    {
        scheduled: false,
    }
)

task.start();

