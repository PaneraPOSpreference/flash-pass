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
    const mypusher = new Pusher("70828d56adadbb8fa7cb", { // process.env.NEXT_PUBLIC_PUSHER_APP_KEY
      cluster: 'us2', // process.env.NEXT_PUBLIC_PUSHER_CLUSTER
      encrypted: true,
    })
    console.log('mypusher:', mypusher)
    const mychannel = mypusher.subscribe(PUSHER_CHANNEL)
    console.log('mychannel:', mychannel)
    setChannel(mychannel)
    setPusher(mypusher)
    setConnected(true)

    return () => {
      resetPusher()
      setPusher(null)
      setConnected(false)
      setChannel(null)
      setMessage(null)
    }
  }, [])

  useEffect(() => {
    if(channel) {
      channel.bind(PUSHER_EVENT, (data) => {
        console.log(`${PUSHER_EVENT}:`, data)
        setMessage(data.message)
        setUserData(data.userData)
      })
    }
  }, [channel])

  const resetPusher = () => {
    channel.unbind()
    pusher.unsubscribe(channel)
    pusher.disconnect()
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