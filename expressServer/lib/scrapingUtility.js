// services/rehydrationService.js
import { scrapeAll } from "../lib/dataLogic/index.js";
import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASS,
  },
});

export async function rehydrateDatabase() {
  try {
    console.log("Starting database rehydration...");

    // Get all queries that need to be processed
    const queries = await prisma.query
      .findMany
      //   {
      //   where: {
      //     nextRunAt: {
      //       lte: new Date(), // Only queries that are due for running
      //     },
      //   },
      // }
      ();

    console.log(`Found ${queries.length} queries to process`);

    // Process each query
    for (const query of queries) {
      console.log(`Processing query: ${query.query}`);

      try {
        // Use your existing scrapeAll function
        await scrapeAll(query.query);

        // Update the nextRunAt for this query
        await prisma.query.update({
          where: { id: query.id },
          data: {
            nextRunAt: new Date(Date.now() + 2 * 60 * 1000), // 2 mins from now for testing purpose TODO: change later
          },
        });

        console.log(`✅ Successfully processed query: ${query.query}`);
      } catch (error) {
        console.error(`❌ Error processing query ${query.query}:`, error);
      }
    }

    // Check for price alerts after rehydration
    const alerts = await checkPriceAlerts();

    // Send email notifications
    await sendEmailNotifications(alerts);

    console.log("Database rehydration completed successfully");
    return { success: true, alertsProcessed: alerts.length };
  } catch (error) {
    console.error("Error in rehydrateDatabase:", error);
    throw error;
  }
}

async function checkPriceAlerts() {
  try {
    console.log("Checking for price alerts...");

    // Get all tracked listings with their current prices
    const tracksWithListings = await prisma.track.findMany({
      include: {
        Listing: {
          select: {
            price: true,
            title: true,
            platform: true,
          },
        },
      },
    });

    const alerts = [];

    for (const track of tracksWithListings) {
      if (!track.Listing) continue; // Skip if listing doesn't exist

      const currentPrice = track.Listing.price;

      if (currentPrice <= track.minPrice) {
        alerts.push({
          email: track.email,
          productTitle: track.Listing.title,
          platform: track.Listing.platform,
          currentPrice: currentPrice,
          trackedPrice: track.minPrice,
          listingId: track.listingId,
          trackId: track.id,
        });

        console.log(
          `📢 Price alert for ${track.Listing.title}: ${currentPrice} <= ${track.minPrice}`
        );
      }
    }

    console.log(`Found ${alerts.length} price alerts`);
    return alerts;
  } catch (error) {
    console.error("Error checking price alerts:", error);
    return [];
  }
}

async function sendEmailNotifications(alerts) {
  if (alerts.length === 0) {
    console.log("No alerts to notify");
    return;
  }

  console.log(`Sending ${alerts.length} email notifications...`);

  for (const alert of alerts) {
    const { url: listingUrl } = await prisma.listing.findUnique({
      where: {
        id: alert.listingId,
      },
      select: {
        url: true,
      },
    });
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: alert.email,
        subject: `Price Alert: ${alert.productTitle}`,
        html: `
          <h2>Price Alert!</h2>
          <p>The product you're tracking has reached your target price.</p>
          <ul>
            <li><strong>Product:</strong> ${alert.productTitle}</li>
            <li><strong>Platform:</strong> ${alert.platform}</li>
            <li><strong>Current Price:</strong> Rs. ${alert.currentPrice}</li>
            <li><strong>Your Target Price:</strong> Rs. ${alert.trackedPrice}</li>
          </ul>
          <p><a href="${listingUrl}">View Product</a></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${alert.email} for ${alert.productTitle}`);
      console.log(listingUrl);
      //now deleting track from db
      await prisma.track.delete({
        where: {
          id: alert.trackId,
        },
      });
    } catch (error) {
      console.error(`❌ Failed to send email to ${alert.email}:`, error);
    }
  }
}
