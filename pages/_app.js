import '../styles/globals.css'
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }) {
  

  return (
    <RecoilRoot>
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
    </RecoilRoot>
  )
}

export default MyApp
