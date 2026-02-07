import { getSummrize } from "../controllers/GetSummrize.js"
import { Router } from "express"

import rateLimit from "express-rate-limit"

const router = Router()

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 1, // Limit each IP to 1 request per windowMs
    message: {
        error: "Rate limit exceeded. You can summarize only one video every 3 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
})

router.post("/summrize", getSummrize)


export default router