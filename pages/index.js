import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import logo from '../public/logo.svg'
import ConnectPusher from '../components/ConnectPusher'

const testUserId = "dsfafdf"

export default function Home({
  userData,
  setUserData,
  menuItems,
  setMenuItems,
}) {
  const [userId, setUserId] = useState(testUserId || "")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null)

  useEffect(() => {
    // fetch menuItems
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`)
      .then(res => res.json())
      .then(data => {
        console.log('data:', data)
        setMenuItems(data)
      })
      .catch(err => {
        console.log('err:', err)
        setErrors(err)
      })
  }, [])

  const handleChange = e => {
    setUserId(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(userId)

    setLoading(true)
    setErrors(null)

    // fetch call to POST api at /api/user
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
        setErrors(err)
      })

    setLoading(false)
  }

  const clearUser = () => {
    setUserData(null)
    setLoading(false)
    setErrors(null)
    setUserId("")
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Flash Pass | Tiger Hacks 2021</title>
        <meta name="description" content="Order your favorite panera items more easily than ever!" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main className={styles.main}>
        <h1>Welcome to <Image src={logo} alt="flash pass logo" /> Flash Pass</h1>
        <ConnectPusher userData={userData} setUserData={setUserData} />
        {userData ? (
          <div>
            <h2>Welcome back, {userData.name || "Anon"}</h2>
            <section>
              <button onClick={clearUser}>Logout</button>
            </section>
            <section>
              <p>Your order history:</p>
              <ul>
                {userData.orders?.map(order => (
                  <li key={order.id}>
                    <p>{order.items.map(item => item.name).join(", ")}</p>
                    <p>{order.total}</p>
                  </li>
                ))}
                {(!userData.orders || userData.orders.length == 0) && (
                  <li>
                    <p>You have no orders yet!</p>
                  </li>
                )}
              </ul>
            </section>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {loading && <p>Loading...</p>}
            {errors && <p style={{color: 'red', opacity: 0.8}}>{errors.toString()}</p>}
            <label htmlFor="user-id">User ID</label>
            <input id="user-id" name="user-id" type="text" required value={userId} onChange={handleChange} />
            <button type="submit" disabled={loading}>Submit</button>
          </form>
        )}
      </main>
    </div>
  )
}
