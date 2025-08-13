import axios from "axios";
import logger from "../utils/logger.js";

export async function handleWebhookNotification(req, res) {
  const headers = {
    channelId: req.headers["x-goog-channel-id"],
    resourceId: req.headers["x-goog-resource-id"],
    resourceState: req.headers["x-goog-resource-state"],
    messageNumber: req.headers["x-goog-message-number"],
  };

  res.status(200).end("OK");

  try {
    await axios.post(
      `${process.env.ARKIVE_BACKEND_BASE_URL}/internal/drive/notify`,
      {},
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SHARED_SECRET,
          "x-goog-channel-id": headers.channelId || "",
          "x-goog-resource-id": headers.resourceId || "",
          "x-goog-resource-state": headers.resourceState || "",
          "x-goog-message-number": headers.messageNumber || "",
        },
        timeout: 8000,
      }
    );
    logger.info("Forwarded webhook to Arkive backend", headers);
  } catch (e) {
    logger.error("Failed to forward webhook:", e.message);
  }
}
