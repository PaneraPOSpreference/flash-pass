const UserModel = require('../model/User')

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

  try {
    const result = await UserModel.find({id: userId});

    // if result is not found, create one

    console.log("found user data:", result)
    
    if(!result || result.length === 0) {
      const User = new UserModel({id: userId});
      const save_result = await User.save();
      console.log('result:', save_result)
      return res.status(201).send({
        ok: true,
        message: "Created a new user successfully",
        data: {
          ...save_result,
          id: save_result.id,
        }
      })
    }

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
