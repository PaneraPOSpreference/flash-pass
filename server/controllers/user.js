import { mockUserData  } from "../mocks/user";

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

  return res.status(200).send({
    ok: true,
    message: "userID received",
    data: mockUserData
  });
}