import { Router } from "express";
import { handleWebhookNotification } from "../controllers/webHookController.js";


const router = Router();

// Google posts to this
router.post("/google-drive", handleWebhookNotification);

export default router;
