import UserModel from '../model/User'
import Pusher from "pusher"

const PUSHER_CHANNEL="user-id-channel"
const PUSHER_EVENT="get-user-id"

// create
export const postUserHandler = async (req, res) => {
  console.log('user id:', req.body.userId);

  let userId = req.body.userId;

  if(!userId) {
    // send error
    return res.status(400).send({
      ok: false,
      message: 'userId is required'
    });
  }

  // connect pusher
  let pusher;
  try {
    pusher = new Pusher({
      appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true
    });
    if(pusher) console.log('pusher connected successfully');
  } catch (error) {
    console.log('pusher error:', error);
    return res.status(400).send({ok: false, message:"Could not connect Pusher"})
  }

  try {
    const result = await UserModel.find({id: userId});

    // if result is not found, create one

    console.log("found user data:", result)
    
    let pusher_result;
    if(!result || result.length === 0) {
      const User = new UserModel({id: userId});
      const save_result = await User.save();
      console.log('result:', save_result)
      // before sending, trigger pusher
      pusher_result = await pusher.trigger(PUSHER_CHANNEL, PUSHER_EVENT, {
        message: "Created new user",
        userData: {
          userId,
        }
      });
      console.log('pusher result:', pusher_result)
      return res.status(201).send({
        ok: true,
        message: "Created a new user successfully",
        data: {
          id: save_result.id
        }
      })
    }

    // before sending, trigger pusher
    pusher_result = await pusher.trigger(PUSHER_CHANNEL, PUSHER_EVENT, {
      message: "Found the user",
      userData: {
        userId,
      }
    });
    console.log('pusher result:', pusher_result)

    return res.status(200).send({
      ok: true,
      message: "userID received",
      data: result
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}

// update request
export const putUserHandler = async (req, res) => {
  console.log("req.body:", req.body)
  console.log('userId:', req.body.userId)
  
  let userId = req.body.userId;

  // if no userId received
  if(!userId) {
    // send error
    return res.status(400).send({
      ok: false,
      message: 'userId is required'
    });
  }

  try {
    const result = await UserModel.find({id: userId});

    console.log("found user data:", result)

    // if result is not found, return error
    if(!result || result.length === 0) {
      console.log("No user found")
      return res.status(404).send({
        ok: false,
        message: "No user found",
        data: {}
      })
    }

    const foundUser = result[0]

    // add account
    foundUser.set(req.body)

    const newUser = await foundUser.save();

    console.log("newUser:", newUser)

    return res.status(200).send({
      ok: true,
      message: "user updated",
      data: newUser
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}

// get
export const getUserHandler = async (req, res) => {
  console.log('user id:', req.query.userId);

  let userId = req.query.userId;

  if(!userId) {
    // send error
    return res.status(400).send({
      ok: false,
      message: 'userId is required'
    });
  }

  try {
    const result = await UserModel.find({id: userId});

    // if result is not found, return error message

    console.log("found user data:", result)
    
    if(!result || result.length === 0) {
      const User = new UserModel({id: userId});
      const save_result = await User.save();
      console.log('result:', save_result)
      return res.status(201).send({
        ok: true,
        message: "Created a new user successfully",
        data: {
          id: save_result.id,
          name: save_result.name
        }
      })
    }

    return res.status(200).send({
      ok: true,
      message: "user found",
      data: result[0]
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}