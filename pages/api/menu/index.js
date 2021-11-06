import connectDB from '../../../middleware/mongodb'
import {
  getMenuHandler
} from '../../../controllers/menu'
import NextCors from 'nextjs-cors'

const menuHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
 });

  switch(req.method) {
    case "GET":
      return getMenuHandler(req, res);
    default:
      return res.status(400).send({ok: false, message: "Request type not supported"})
  }
}

export default connectDB(menuHandler)