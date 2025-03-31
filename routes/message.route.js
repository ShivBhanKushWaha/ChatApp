import express from "express"
import { sendMessage,getMessage } from "../controller/message.controller.js"
import secureRoutes from "../middleware/secureRoute.js";
const router = express.Router()

router.post('/send/:id',secureRoutes, sendMessage);
router.get('/get/:id',secureRoutes,getMessage)

export default router