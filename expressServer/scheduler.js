const cron = require("node-cron")
const { getTimestamp } = require("./db")

cron.schedule("* * * * *", async () => {
    try {
        const timestamp = await getTimestamp()
        console.log(`✅ Automated run at DB timestamp: ${timestamp}`)
    } catch (err) {
        console.error("❌ Error fetching timestamp:", err.message)
    }
});

