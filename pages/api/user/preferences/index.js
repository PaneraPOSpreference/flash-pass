import connectDB from '../../../../middleware/mongodb'
import { getUserPreferenceHandler } from '../../../../controllers/preferences'
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
      return getUserPreferenceHandler(req, res);
    default:
      return res.status(400).send({ok: false, message: "Request type not supported"})
  }
}

export default connectDB(userHandler)