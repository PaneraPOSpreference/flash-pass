import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import { readdirSync } from "fs"
import morgan from "morgan"

require("dotenv").config()

// create express app
const app = express()

// apply middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
// app.use((req, res, next) => {
//   console.log("this is my own middleware")
//   next()
// })

// route
readdirSync("./routes").map((r) => 
  app.use("/api", require(`./routes/${r}`))
)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log(err))

// port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}. See it at http://localhost:${port}`))
