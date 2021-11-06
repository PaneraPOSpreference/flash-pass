import { useState, useEffect } from 'react'
import Pusher from 'pusher-js'

export const PUSHER_CHANNEL="user-id-channel"
export const PUSHER_EVENT="get-user-id"

const ConnectPusher = () => {
  const [connected, setConnected] = useState(false)
  const [pusher, setPusher] = useState(null)
  const [channel, setChannel] = useState(null)
  const [pusherData, setPusherData] = useState(null)

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
      setPusherData(null)
    }
  }, [])

  useEffect(() => {
    if(channel) {
      channel.bind(PUSHER_EVENT, (data) => {
        console.log(`${PUSHER_EVENT}:`, data)
        let string_data = JSON.stringify(data)
        alert(string_data);
        setPusherData(string_data)
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
      <h4>Pusher</h4>
      {(connected && pusher && channel) ? <p>Connected to pusher</p> : <p>Not Connected to Pusher</p>}
      {pusherData && <p>Got pusher data: {pusherData}</p>}
    </section>
  )
}

export default ConnectPusher