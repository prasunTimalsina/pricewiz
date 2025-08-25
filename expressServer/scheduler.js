import cron from "node-cron";
import { scrapeQueries } from "./lib/scrapingUtility.js";

const task = cron.schedule(
  "0 */2 * * * *",
  async () => {
    try {
      try {
        await scrapeQueries();
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
