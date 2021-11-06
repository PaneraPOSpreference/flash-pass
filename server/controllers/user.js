const UserModel = require('../model/User')

export const postUserHandler = (req, res) => {
  console.log('user id:', req.body.userId);

  let userId = req.body.userId;

  if(!userId) {
    // send error
    return res.status(400).send({
      ok: false,
      message: 'userId is required'
    });
  }

  // do something with userId. for now, return mock user data
  UserModel.find({id: userId}, function(err, result) {
    if (!err) {
      console.log("found user data:", result)
      return res.status(200).send({
        ok: true,
        message: "userID received",
        data: result
      });
    } else {
      console.log("mongoose error:", err);
      return res.status(400).send({
        ok: false,
        message: "Cannot find the user information"
      })
    }
  });
  }