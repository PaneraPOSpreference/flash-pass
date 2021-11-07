import '../styles/globals.css'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  

  return (
    <Component
      {...pageProps}
      // userData={userData}
      // setUserData={setUserData}
      // menuItems={menuItems}
      // setMenuItems={setMenuItems}
      // order={order}
      // cart={cart}
      // setCart={setCart}
      // setOrder={setOrder}
    />
  )
}

export default MyApp
