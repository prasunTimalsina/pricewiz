const express = require("express")
const app = express()
const PORT = 4000

// Import the scheduler
require("./scheduler")

app.get("/", (req, res) => {
    res.send("Hello from Express server with Cron Scheduler!")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

