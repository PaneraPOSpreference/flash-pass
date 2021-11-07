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

  let pusher;
  let skipPusher = false;

  if(req.body._from && req.body._from === "app") {
    console.log('skipping pusher')
    skipPusher = true;
  }

  if(!skipPusher) {
    // connect pusher
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
  }

  try {
    const result = await UserModel.find({id: userId});

    // if result is not found, create one

    console.log("found user data:", result)
    
    let pusher_result;
    if(!result || result.length === 0) {
      const User = new UserModel({id: userId});
      const save_result = await User.save();
      // before sending, trigger pusher
      if(!skipPusher) {
        pusher_result = await pusher.trigger(PUSHER_CHANNEL, PUSHER_EVENT, {
          message: "Created new user",
          userData: {
            userId,
          }
        });
      }

      return res.status(201).send({
        ok: true,
        message: "Created a new user successfully",
        data: save_result.data.length ? save_result.data[0] : save_result.data
      })
    }

    // before sending, trigger pusher
    if(!skipPusher) {
      pusher_result = await pusher.trigger(PUSHER_CHANNEL, PUSHER_EVENT, {
        message: "Found the user",
        userData: {
          userId,
        }
      });
    }

    return res.status(200).send({
      ok: true,
      message: "userID received",
      data: result.length ? result[0] : result
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

// get user
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

    // if result is not found, create new user

    console.log("found user data:", result)
    
    if(!result || result.length === 0) {
      const User = new UserModel({id: userId});
      const save_result = await User.save();
      console.log('result:', save_result)
      return res.status(201).send({
        ok: true,
        message: "Created a new user successfully",
        data: save_result.data
      })
    }

    return res.status(200).send({
      ok: true,
      message: "user found",
      data: result[0].data
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}

// get user preferences
export const getUserPreferenceHandler = async (req, res) => {
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
      return res.status(404).send({
        ok: false,
        message: "User not found",
      })
    }

    return res.status(200).send({
      ok: true,
      message: "user found, here are the favorites",
      data: result[0].favorite
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}

// get user history
export const getUserHistoryHandler = async (req, res) => {
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
      return res.status(404).send({
        ok: false,
        message: "User not found",
      })
    }

    return res.status(200).send({
      ok: true,
      message: "user found, here is the history",
      data: result[0].history
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}