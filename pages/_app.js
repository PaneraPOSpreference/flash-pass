import '../styles/globals.css'
import { useState } from 'react'

export const ordersMock = {
  name: "John",
  orders: [
    {
      id: 1,
      items: [
        {
          id: 1,
          name: "Coffee"
        },
        {
          id: 2,
          name: "Bread"
        }
      ],
      price: 2.5,
      storeId: 5,
      date: Date.now() // timestampe
    },
    {
      id: 2,
      items: [
        {
          id: 1,
          name: "Pastry"
        },
      ],
      name: "Coffee",
      price: 3.5,
      storeId: 5,
      date: Date.now()
    },
  ]
}

function MyApp({ Component, pageProps }) {
  const [userData, setUserData] = useState(null)
  const [menuItems, setMenuItems] = useState(null)

  return (
    <Component
      {...pageProps}
      userData={userData}
      setUserData={setUserData}
      menuItems={menuItems}
      setMenuItems={setMenuItems}
    />
  )
}

export default MyApp
