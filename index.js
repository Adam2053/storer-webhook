import express, { urlencoded } from "express";
import dotenv from "dotenv";
import webhookRoute from "./routes/webhooksRoute.js";
import connectDB from "./db/dbConnect.js";
import { registerDriveWebhook } from "./services/googleDriveServices.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/health", (_, res) => res.status(200).json({ ok: true }));

app.use("/webhook", webhookRoute);
const PORT = 3002
app.listen(PORT, async (req, res) => {
  console.log(`🚀 Drive Webhook Service on :${PORT}`);
  try {
    // register webhook on boot (single-user dev mode)
    connectDB();
    await registerDriveWebhook();
  } catch (e) {
    console.error("Webhook registration failed at startup:", e.message);
  }
});
