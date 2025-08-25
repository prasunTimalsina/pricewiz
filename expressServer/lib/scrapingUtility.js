import prisma from "./prisma.js";
import { scrapeAll } from "./dataLogic/index.js";

export const scrapeQueries = async () => {
  const queries = await prisma.query.findMany();

  for (const q of queries) {
    await scrapeAll(q.query);
    console.log("scraped", q.query);
  }

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  console.log(`Scraped at ${hours}:${minutes}`);
};
