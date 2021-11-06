import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import logo from '../public/logo.svg'

export default function Home() {
  const [userId, setUserId] = useState("")
  const [errors, setErrors] = useState(null)

  const handleChange = e => {
    setUserId(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(userId)

    // fetch call to POST api at /api/users
    // fetch('/api/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ userId })
    // })
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    //   .catch(err => {
    //     console.log(err)
    //     setErrors(err)
    //   })
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
        <form onSubmit={handleSubmit}>
          {errors && <p style={{color: 'red', opacity: 0.8}}>{errors.toString()}</p>}
          <label htmlFor="user-id">User ID</label>
          <input id="user-id" name="user-id" type="text" required value={userId} onChange={handleChange} />
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  )
}
