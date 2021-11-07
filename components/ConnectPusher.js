import { useState, useEffect } from 'react'
import Pusher from 'pusher-js'

export const PUSHER_CHANNEL="user-id-channel"
export const PUSHER_EVENT="get-user-id"

const ConnectPusher = ({
  userData,
  setUserData
}) => {
  const [connected, setConnected] = useState(false)
  const [pusher, setPusher] = useState(null)
  const [channel, setChannel] = useState(null)
  const [message, setMessage] = useState(null)

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
    setConnected(true)

    return () => {
      console.log('unmounting pusher')
      resetPusher()
      setPusher(null)
      setConnected(false)
      setChannel(null)
      setMessage(null)
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

  const resetPusher = () => {
    if(channel) channel.unbind()
    if(pusher && channel) pusher.unsubscribe(channel)
    if(pusher) pusher.disconnect()
  }

  return (
    <section>
      <h4>Pusher: {(connected && pusher && channel) ? <span>Connected</span> : <span>Not Connected</span>}</h4>
      {userData && (
        <>
          <p>status: {message}</p>

          <ul>
            {Object.keys(userData).map((key, index) => (
              <li key={index}>{key}: {userData[key]}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default ConnectPusher