const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

async function getTimestamp() {
    const res = await pool.query("SELECT NOW()")
    return res.rows[0].now
}

module.exports = { getTimestamp };

