import UserModel from '../model/User'
import MenuModel from '../model/Menu'
import Pusher from "pusher"

const PUSHER_CHANNEL="user-id-channel"
const PUSHER_EVENT="get-user-id"

const PUSHER_CHANNEL_ORDER="user-order-channel"
const PUSHER_EVENT_ORDER="user-order-event"

const PUSHER_CHANNEL_PURCHASE="user-purchase-channel"
const PUSHER_EVENT_PURCHASE="user-purchase-event"

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
      const User = new UserModel({id: userId, name: "Anon"});
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
        data: [{
          id: userId,
          name: "Anon"
        }]
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

    const output = result.length ? result[0] : result
    console.log("output:",output)
    return res.status(200).send({
      ok: true,
      message: "userID received",
      data: [{
        id: output.id,
        name: (output.data.name === "")?"Anon":output.data.name
      }]
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
        message: "No user found"
      })
    }

    const foundUser = result[0]

    // add account
    let data = {
      ...req.body,
      name: req.body.name,
      data: {
        id:(req.body).userId,
        name:(req.body).name
      }
    }
    foundUser.set(data)

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

// adding new menu item to user.cart
export const postUserHistoryHandler = async (req, res) => {
  console.log('user ipostCheckoutd:', req.body.userId);

  let userId = req.body.userId;
  let itemId = req.body.itemId;

  if(!userId) {
    // send error
    return res.status(400).send({
      ok: false,
      message: 'userId is required'
    });
  }
  if(!itemId) {
    // send error
    return res.status(400).send({
      ok: false,
      message: 'itemId is required'
    });
  }

  // setup Pusher
  const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true
  });

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

    console.log('found user:', foundUser)

    const menuItem = await MenuModel.find({id: Number(itemId)})
    console.log('menu item:', menuItem)

    let foundCart, newCart, pusher_result;
    if(!menuItem || menuItem.length == 0) {
      foundCart = (Array.isArray(foundUser.cart)) ? foundUser.cart : []
      newCart = [...foundCart, "3"]
      console.log("new cart:", newCart)
      // foundUser.cart = newCart;
      // console.log('found user:', foundUser)

      UserModel.updateOne(
        {id: userId}, 
        {cart : newCart },
        {multi:false}, 
          function(err, numberAffected){
            if(err) {
              console.log('error updating:', err)
              return;
            }  
            console.log('success updated user times:', numberAffected)
          });   
        

      // add menu item to foundUser
      // let data = {
      //   cart: [...foundCart, "3"] //(!foundUser.cart || !foundUser.cart.length) ? [] : foundUser.cart
      // }
      // console.log("data:", data)
      // // data.cart.push("3")
      // foundUser.set(data)
  
      // let temp_save_user = await foundUser.save();
  
      // console.log("updated user:", temp_save_user)

      // send event to menu ui
      console.log('triggering event')
      pusher_result = await pusher.trigger(PUSHER_CHANNEL_ORDER, PUSHER_EVENT_ORDER, {
        message: "Added item to order",
        order: "3" // array of strings
      });

      // send back res
      return res.status(200).send({
        ok: true,
        message: "couldnt find that item but whatever",
        data: [{
          itemId: "3",
          name: "None",
          price: "9.99"
        }]
      })
    }

    foundCart = (Array.isArray(foundUser.cart)) ? foundUser.cart : []
    newCart = [...foundCart, menuItem[0].id]
    console.log("new cart:", newCart)

    UserModel.updateOne(
      {id: userId}, 
      {cart : newCart },
      {multi:false}, 
        function(err, numberAffected){
          if(err) {
            console.log('error updating:', err)
            return;
          }  
          console.log('success updated user times:', numberAffected)
        });

    // add menuItem.id to foundUser's array of item ids in foundUser.cart
      // if foundUser.cart is undefined, initialize it with an empty array, then add the id
    // let data = {
    //   cart: (!foundUser.cart || !foundUser.length) ? [] : foundUser.cart
    // }
    // console.log('menu item:', menuItem)
    // data.cart.push(menuItem.id)
    // foundUser.set(data)

    // const newUser = await foundUser.save();

    // console.log("updated user:", newUser)

    console.log('triggering event 2')
    // send event to menu ui
    pusher_result = await pusher.trigger(PUSHER_CHANNEL_ORDER, PUSHER_EVENT_ORDER, {
      message: "Added item to order",
      order: menuItem[0].id // array of strings
    });

    // send back res
    return res.status(200).send({
      ok: true,
      message: "user found, here is the history",
      data: [{
        itemId: menuItem[0].id,
        name: menuItem[0].name,
        price: menuItem[0].price
      }]
    });

  } catch(error) {
    console.log("mongoose error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error getting user: " + error.message
    })
  }
}

// move cart to history
// simulate purchase, send user.cart items to user.history, clear user.cart, return nothing but a message
export const postCheckoutHandler = async (req, res) => {
  console.log('user id:', req.body.userId);

  let userId = req.body.userId;

  if(!userId) {
    // send error
    return res.status(400).send({
      ok: false,
      message: 'userId is required'
    });
  }

  // setup pusher
  const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true
  });

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

    const oldCart = foundUser.cart    
    
    // update user
    let data = {
      history: (!foundUser.history || foundUser.history.length === 0) ? [] : foundUser.history
    }
    data.history.push(oldCart)

    // save user with new order in history
    foundUser.set(data)
  
    const newUser = await foundUser.save();

    console.log("updated user:", newUser)

    // clear cart
    // get cart items from user
    console.log('user cart:', foundUser.cart)

    // sent cart items to user


    // clear cart
    data = {
      cart: []
    }
    // update user
    foundUser.set(data)
  
    const updated_user = await foundUser.save();

    console.log('updated user in postCheckout:', updated_user)

    // trigger event
    let pusher_result = await pusher.trigger(PUSHER_CHANNEL_PURCHASE, PUSHER_EVENT_PURCHASE, {
      message: "Checkout complete",
    });

    return res.status(200).send({
      ok: true,
      message: "Purchase has been completed",
    });

  } catch(error) {
    console.log("purchase error:", error);

    return res.status(400).send({
      ok: false,
      message: "Error purchasing user order: "//error.message
    })
  }
}