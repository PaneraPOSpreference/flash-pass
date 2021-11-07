import connectDB from '../../../middleware/mongodb'
import {
  getUserHistoryHandler
} from '../../../controllers/user'
import NextCors from 'nextjs-cors'

const userHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
 });

  switch(req.method) {
    case "GET":
      return getUserHistoryHandler(req, res);
    case "POST":
      return postPurchaseHandler(req, res);
    default:
      return res.status(400).send({ok: false, message: "Request type not supported"})
  }
}

export default connectDB(userHandler)