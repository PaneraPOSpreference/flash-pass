import express from "express"

const router = express.Router()

// controllers
import { postUserHandler } from "../controllers/user"

router.post("/user", postUserHandler)

module.exports = router