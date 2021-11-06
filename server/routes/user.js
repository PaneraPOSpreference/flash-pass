import express from "express"
import { postUserHandler } from "../controllers/user"

const router = express.Router()

// controller
router.post("/user", postUserHandler)

module.exports = router
