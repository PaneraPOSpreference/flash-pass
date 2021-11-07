import UserModel from '../model/User'

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

    const foundUser = result[0]

    return res.status(200).send({
      ok: true,
      message: "user found, here are the favorites",
      data: foundUser.favorite
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}