import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function getTimestamp() {
    const res = await pool.query("SELECT NOW()")
    return res.rows[0].now
}

