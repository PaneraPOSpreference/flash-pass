import UserModel from '../model/User'
import MenuModel from '../model/Menu'
import OrderModel from '../model/Orders'
import { menuItems } from '../mocks/menu'
import Pusher from "pusher"

const PUSHER_CHANNEL_ORDER="user-order-channel"
const PUSHER_EVENT_ORDER="user-order-event"

const PUSHER_CHANNEL_PURCHASE="user-purchase-channel"
const PUSHER_EVENT_PURCHASE="user-purchase-event"

// adding new menu item to user.cart
export const postUserCartHandler = async (req, res) => {
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
      newCart = [
        ...foundCart, 
        new MenuModel({
            name:"Broccoli Cheddar Soup Soup",
            id: 14,
            type:["Lunch", "Dinner"],
            category:"Soup",
            price:"4.5"
          })
      ]
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
    newCart = [...foundCart, menuItem[0]]
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

    console.log('triggering event 2')

    // send event to menu ui
    pusher_result = await pusher.trigger(PUSHER_CHANNEL_ORDER, PUSHER_EVENT_ORDER, {
      message: "Added item to order",
      order: menuItem[0].id // array of menu items
    });

    // send back res
    return res.status(200).send({
      ok: true,
      message: "menu item found, here is the info",
      data: [{
        itemId: menuItem[0].id,
        name: menuItem[0].name,
        price: menuItem[0].price.toString()
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
    const oldCart = (!foundUser.cart || foundUser.cart.length === 0) ? [] : foundUser.cart
    const price = (!Array.isArray(oldCart) || oldCart.length === 0) ? 0 : oldCart.reduce((prev,curr) => (prev+Number(curr.price)),0)
    console.log("Price:",price)

    let ordersLen = (!foundUser.history || foundUser.history.length === 0) ? 0 : foundUser.history.length

    // create order object to update user history with
    let newOrder = new OrderModel({
      ...foundUser.history,
      items: oldCart,
      price: price,
      timestamp: {
        ...foundUser.history.timestamp,
        end: Date.now()
      }
    })

    let ordersList = {
      history: (!foundUser.history || foundUser.history.length === 0) ? [] : foundUser.history
    }
    ordersList.history.push(newOrder)

    // save user with new order in history
    foundUser.set(ordersList)
  
    const newUser = await foundUser.save();

    console.log("updated user:", newUser)

    // clear cart
    // get cart items from user
    console.log('user cart:', foundUser.cart)
    console.log('order items:', newOrder.items)

    // clear cart
    const data = {
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