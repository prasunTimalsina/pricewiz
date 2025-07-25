import express from "express"
import "./scheduler.js"

const app = express()
const PORT = 4000

app.get("/", (req, res) => {
    res.send("express server")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

