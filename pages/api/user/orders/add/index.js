import connectDB from '../../../../../middleware/mongodb'
import { postUserHistoryHandler } from '../../../../../controllers/orders'
import NextCors from 'nextjs-cors'

const userHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
 });

  switch(req.method) {
    case "POST":
      return postUserHistoryHandler(req, res);
    default:
      return res.status(400).send({ok: false, message: "Request type not supported"})
  }
}

export default connectDB(userHandler)