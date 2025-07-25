//import cron from "node-cron"
//import { getTimestamp } from "./db.js"
//
//const task = cron.schedule(
//    "* * * * *",
//    async () => {
//        try {
//            const timestamp = await getTimestamp()
//            console.log(`✅ Automated run at DB timestamp: ${timestamp}`)
//        } catch (err) {
//            console.error("❌ Error fetching timestamp:", err.message)
//        }
//    },
//    {
//        scheduled: false,
//    }
//)
//
//task.start();

import cron from "node-cron"

const timeLogger = cron.schedule(
    "* * * * *", // every minute
    () => {
        const now = new Date().toLocaleString()
        console.log(`🕒 Current time: ${now}`)
    },
    {
        scheduled: false,
    }
)

timeLogger.start();

