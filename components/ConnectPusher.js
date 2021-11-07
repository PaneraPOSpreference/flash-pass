import { useState, useEffect } from 'react'
import Pusher from 'pusher-js'

export const PUSHER_CHANNEL="user-id-channel"
export const PUSHER_EVENT="get-user-id"

export const PUSHER_CHANNEL_ORDER="user-order-channel"
export const PUSHER_EVENT_ORDER="user-order-event"


const ConnectPusher = ({
  userData,
  setUserData,
  order,
  setOrder
}) => {
  const [connected, setConnected] = useState(false)
  const [pusher, setPusher] = useState(null)
  const [channel, setChannel] = useState(null)
  const [message, setMessage] = useState(null)

  const [orderChannel, setOrderChannel] = useState(null)
  const [orderMessage, setOrderMessage] = useState(null)

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
        setOrderMessage(data.message)
        setOrder([...order, data.order])
      })
    }
  }, [orderChannel])

  const resetPusher = () => {
    if(channel) channel.unbind()
    if(pusher && channel) pusher.unsubscribe(channel)

    if(orderChannel) orderChannel.unbind()
    if(pusher && orderChannel) pusher.unsubscribe(orderChannel)

    if(pusher) pusher.disconnect()
  }

  return (
    <section>
      <h4>Pusher: {(connected && pusher && channel) ? <span>Connected</span> : <span>Not Connected</span>}</h4>
      {userData && (
        <div style={{marginBottom: 20}}>
          <p>user data status: {message}</p>

          <ul>
            {Object.keys(userData).map((key, index) => (
              <li key={index}>{key}: {userData[key]}</li>
            ))}
          </ul>
        </div>
      )}
      {order && (
        <div>
          <p>order status: {orderMessage}</p>

          <ul>
            {Object.keys(order).map((key, index) => (
              <li key={index}>{key}: {order[key]}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default ConnectPusher