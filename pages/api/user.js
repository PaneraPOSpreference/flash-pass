import connectDB from '../../middleware/mongodb'
import {
  postUserHandler,
  putUserHandler
} from '../../controllers/user'

const userHandler = async (req, res) => {
  switch(req.method) {
    case "POST":
      return postUserHandler(req, res);
    case "PUT":
      return putUserHandler(req, res);
    default:
      return res.status(400).send({ok: false, message: "Request type not supported"})
  }
}

export default connectDB(userHandler)