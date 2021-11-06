import express from "express"

const router = express.Router()

// controllers
import {user} from "../controllers/user"

router.get("/user", user)

module.exports = router