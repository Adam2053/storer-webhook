import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import logger from "../utils/logger.js";
import { getGoogleAuthClient } from "../config/googleAuth.js";

export async function getStartPageToken(auth) {
  const drive = google.drive({ version: "v3", auth });
  const res = await drive.changes.getStartPageToken();
  return res.data.startPageToken;
}

export const registerDriveWebhook = async () => {
  try {
    const auth = await getGoogleAuthClient();

    // This ensures the token is fully refreshed before making API calls
    await auth.getAccessToken();

    const drive = google.drive({ version: "v3", auth });

    const startToken = (await drive.changes.getStartPageToken()).data.startPageToken;

    const res = await drive.changes.watch({
      pageToken: startToken,
      requestBody: {
        id: "arkive-drive-webhook-12345", // must be unique every time you register
        type: "web_hook",
        address: process.env.WEBHOOK_URL // your webhook endpoint
      }
    });

    console.log("✅ Webhook registered:", res.data);
  } catch (err) {
    console.error("❌ Webhook registration failed:", err.response?.data || err.message);
  }
};

