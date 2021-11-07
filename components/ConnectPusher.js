import { useState, useEffect } from 'react'
import Pusher from 'pusher-js'
import colors from '../styles/colors'

export const PUSHER_CHANNEL="user-id-channel"
export const PUSHER_EVENT="get-user-id"

export const PUSHER_CHANNEL_ORDER="user-order-channel"
export const PUSHER_EVENT_ORDER="user-order-event"

export const PUSHER_CHANNEL_PURCHASE="user-purchase-channel"
export const PUSHER_EVENT_PURCHASE="user-purchase-event"


const ConnectPusher = ({
  userData,
  setUserData,
  order,
  setOrder,
  finished,
  setFinished,
  purchaseOrder,
  addItemToOrder,
  menuItems
}) => {
  const [connected, setConnected] = useState(false)
  const [pusher, setPusher] = useState(null)
  const [channel, setChannel] = useState(null)
  const [message, setMessage] = useState(null)

  const [orderChannel, setOrderChannel] = useState(null)
  const [orderMessage, setOrderMessage] = useState(null)

  const [purchaseChannel, setPurchaseChannel] = useState(null)
  const [purchaseMessage, setPurchaseMessage] = useState(null)

  useEffect(() => {
    // connect pusher
    const mypusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      encrypted: true,
    })
    console.log('mypusher:', mypusher)
    const mychannel = mypusher.subscribe(PUSHER_CHANNEL)
    console.log('mychannel:', mychannel)
    setChannel(mychannel)
    setPusher(mypusher)

    const myorderchannel = mypusher.subscribe(PUSHER_CHANNEL_ORDER)
    console.log('myorderchannel:', myorderchannel)
    setOrderChannel(myorderchannel)

    const mypurchasechannel = mypusher.subscribe(PUSHER_CHANNEL_PURCHASE)
    console.log('mypurchasechannel:', mypurchasechannel)
    setPurchaseChannel(mypurchasechannel)

    setConnected(true)

    return () => {
      console.log('unmounting pusher')
      resetPusher()
      setPusher(null)
      setConnected(false)
      setChannel(null)
      setMessage(null)
      setOrderChannel(null)
      setOrderMessage(null)
      setPurchaseChannel(null)
      setPurchaseMessage(null)
    }
  }, [])

  useEffect(() => {
    if(channel && !message) {
      channel.unbind()
      pusher.unsubscribe(channel)
      channel.bind(PUSHER_EVENT, (data) => {
        console.log(`${PUSHER_EVENT}:`, data)
        setMessage(data.message)
        setUserData(data.userData)
      })
    }
  }, [channel])

  useEffect(() => {
    if(orderChannel && !orderMessage) {
      orderChannel.unbind()
      pusher.unsubscribe(orderChannel)
      orderChannel.bind(PUSHER_EVENT_ORDER, (data) => {
        console.log(`${PUSHER_EVENT_ORDER}:`, data)
        console.log('dsfsdf')
        setOrderMessage(data.message)
        console.log(menuItems)
        addItemToOrder(data.order)
      })
    }
  }, [orderChannel])

  useEffect(() => {
    if(purchaseChannel && !purchaseMessage) {
      purchaseChannel.unbind()
      pusher.unsubscribe(purchaseChannel)
      purchaseChannel.bind(PUSHER_EVENT_PURCHASE, (data) => {
        console.log(`${PUSHER_EVENT_PURCHASE}:`, data)
        setPurchaseMessage(data.message)
        setFinished(true)
        purchaseOrder();
      })
    }
  }, [purchaseChannel])

  const resetPusher = () => {
    if(channel) channel.unbind()
    if(pusher && channel) pusher.unsubscribe(channel)

    if(orderChannel) orderChannel.unbind()
    if(pusher && orderChannel) pusher.unsubscribe(orderChannel)

    if(purchaseChannel) purchaseChannel.unbind()
    if(pusher && purchaseChannel) pusher.unsubscribe(purchaseChannel)

    if(pusher) pusher.disconnect()
  }

  return (
    <section style={{position:'absolute', top: 0, right: 0}}>
      {purchaseChannel && (
        <div style={{opacity:0.8, paddingRight: 15, paddingTop: 10}}>
          {/* <p style={{textAlign:'center',marginBottom:0,marginTop:0,color:colors.gray}}></p> */}
          <p style={{marginTop:"1rem",color:colors.gray,fontWeight:400}}>{finished ? "Order finished" : userData ? "Order in progress" : "Scan QR Code"}</p>
        </div>
      )}
    </section>
  )
}

export default ConnectPusher