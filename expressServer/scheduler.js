import cron from "node-cron";
import { rehydrateDatabase } from "./lib/scrapingUtility.js";
const task = cron.schedule(
  "0 */4 * * * *",
  // 0 0 */4 * * *,
  async () => {
    try {
      try {
        await rehydrateDatabase();
      } catch (err) {
        console.log("failed to run update listing", err);
      }
    } catch (err) {
      console.error("❌ Error fetching timestamp:", err.message);
    }
  },
  {
    scheduled: false,
  }
);

task.start();
