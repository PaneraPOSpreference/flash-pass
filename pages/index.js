import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import logo from '../public/logo.svg'
import ConnectPusher from '../components/ConnectPusher'
import classNames from "classnames"
import {menuItems as mockMenuItems} from '../mocks/menu'

const testUserId = "dsfafdf"

export default function Home({
  // userData,
  // setUserData,
  // menuItems,
  // setMenuItems,
  // order,
  // setOrder,
  // cart,
  // setCart
}) {
  const [userData, setUserData] = useState(null)
  const [menuItems, setMenuItems] = useState(mockMenuItems)
  const [order, setOrder] = useState([])
  const [cart, setCart] = useState([])

  const [userId, setUserId] = useState(testUserId || "")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [activeMenuItemId, setActiveMenuItemId] = useState(null)
  const [showMenu, setShowMenu] = useState(true)
  const [finishedOrder, setFinishedOrder] = useState(false)

  useEffect(() => {
    // if(!menuItems || menuItems.length === 0) {
    // fetch menuItems
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log('data:', data)
    //     setMenuItems(data.data)
    //   })
    //   .catch(err => {
    //     console.log('err:', err)
    //     setErrors(err)
    //   })
    // }
  }, [])

  useEffect(() => {
    console.log('menu items change:', menuItems)
  }, [menuItems])

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
        // setMenuItems(data)
      })
      .catch(err => {
        console.log(err)
        setErrors(err)
      })

    setLoading(false)
  }

  const handleMenuItemClick = (menuItemId) => {
    console.log(menuItemId)
    if(activeMenuItemId === menuItemId)
      setActiveMenuItemId(null)
    else
      setActiveMenuItemId(menuItemId)
  }

  const addItemToOrder = (itemId) => {
    console.log('adding item with id:', itemId, 'to order')

    console.log('prev order:', order)
    console.log('menu items:', menuItems)
    const item = menuItems.find(item => item.id === itemId)
    console.log('order item:', item)
    setOrder(prevOrder => ([...prevOrder, item]))

    console.log('next order:', order)

    // api call
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/orders/add`, {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     userId,
    //     itemId
    //   })
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log('added item to order data:', data)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     setErrors(err)
    //   })
  }

  const removeItemFromOrder = (itemId) => {
    console.log('removing item with id:', itemId, 'from order')
    const newOrder = order.filter(item => item.id !== itemId)
    setOrder(newOrder)
  }

  const purchaseOrder = () => {
    console.log('purchasing order')

    const orderIds = order.map(item => item.id)


    setFinishedOrder(true)
    setShowMenu(false)
    setOrder([])

    setTimeout(() => {
      setFinishedOrder(false)
      setShowMenu(true)
    }, 3000)

    // send api call
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     userId,
    //     order: orderIds // string of ids
    //   })
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log('purchased order data:', data)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     setErrors(err)
    //   })
  }

  const orderAgain = () => {
    setShowMenu(true)
    setFinishedOrder(false)
    setActiveMenuItemId(null)
  }

  const clearUser = () => {
    setUserData(null)
    setLoading(false)
    setErrors(null)
    setActiveMenuItemId(null)
    setUserId("")
    setFinishedOrder(false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Flash Pass | Tiger Hacks 2021</title>
        <meta name="description" content="Order your favorite panera items more easily than ever!" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main className={styles.main}>
        <h1><Image src={logo} alt="flash pass logo" height={32} width={32} /> Bread Pass</h1>
        <ConnectPusher
          userData={userData}
          setUserData={setUserData}
          order={order}
          setOrder={setOrder}
          finished={finishedOrder}
          setFinished={setFinishedOrder}
          purchaseOrder={purchaseOrder}
          addItemToOrder={addItemToOrder}
          menuItems={menuItems}
        />

        <section style={{marginBottom:10}}>
          <h4>Scan the QR Code on your phone for the full experience!</h4>
        </section>

        {/* <p>
          <label>Show Menu</label>
          <input type="checkbox" value={showMenu} onChange={(e) => setShowMenu(e.target.checked)} />
        </p> */}
        {menuItems && menuItems.length && (menuItems.length > 0) && (
          <section className={classNames({"hidden": !showMenu})} style={{display: 'flex', flexWrap: "wrap", justifyContent: "space-evenly", marginBottom: 15}}>
            {menuItems.map((menuItem, index) => (
              <div className={classNames("menu-item", { "highlight-item": activeMenuItemId === menuItem.id})} key={`${index}-${menuItem.name}`} style={{flex: 1, minHeight: 80, minWidth: 150, border: "1px solid rgba(0,0,0,0.1)",paddingLeft: 5, paddingRight: 5, margin: 10, cursor: "pointer"}} onClick={() => handleMenuItemClick(menuItem.id)}>
                <h4 style={{marginTop:0,marginBottom:0,paddingTop:10,paddingBottom:10,textAlign:'center'}}>#{menuItem.id}</h4>
                <h5>{menuItem.name} - ${menuItem.price}</h5>
                <p>{menuItem.types.map((t, t_index) => <span key={`${t}-${t_index}`}>{t}, </span>)}</p>
                <p>{menuItem.category}</p>
              </div>
            ))}
          </section>
        )}

        {showMenu && activeMenuItemId && (
          <div style={{cursor: "pointer", marginBottom: 30}}>
            <button onClick={() => addItemToOrder(activeMenuItemId)}>Add {menuItems.find(item => item.id === activeMenuItemId).name} to order for ${menuItems.find(item => item.id === activeMenuItemId).price}</button>
          </div>
        )}

        {!finishedOrder && order && (
          <div style={{width:"50%", margin: "0 auto", marginBottom: 80}}>
            <h3 style={{textAlign:'center'}}>Your Order:</h3>
            {order.length > 0 && order.map((orderItem, index) => (
              <div className="order-item" key={`${index}-${orderItem.name}`} style={{marginBottom: 8,marginTop:8,borderBottom:"1px solid rgba(33,33,33,.1)", display:'flex',alignItems:'center', paddingLeft: 5, paddingRight: 5}}>
                <button onClick={() => removeItemFromOrder(orderItem.id)} style={{marginRight:10,marginBottom:0}}>Remove</button>
                <h4 style={{flex:1,marginBottom:0,marginTop:0}}>#{orderItem.id} - {orderItem.name}</h4>
                <p style={{marginLeft: 10,marginBottom:0,marginTop:0}}>${orderItem.price.toString()}</p>
              </div>
            ))}

            {order.length > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}>
                <h4 style={{marginBottom:0,marginTop:0}}>Total:</h4>
                <h4 style={{marginBottom:0,marginTop:0}}>${order.reduce((acc, curr) => acc + Number(curr.price), 0)}</h4>
              </div>
            )}

            {order.length > 0 && (
              <div style={{textAlign:'center'}}>
                <button disabled={!order.length || order.length == 0} onClick={() => purchaseOrder()}>Purchase for ${order.reduce((acc, curr) => acc + Number(curr.price), 0)}</button>
              </div>
            )}
          </div>
        )}

        {finishedOrder && (
          <section style={{padding: 20, border: "1px solid rgba(0,0,0,.15)", width: "75%", margin: "20px auto", display:'flex', alignItems:'center',justifyContent:'center',marginBottom:40}}>
            <div className="icon-container" style={{display:'flex',alignItems:'center',justifyContent:'center',paddingRight:30}}>
              <Image src={logo} alt="flash pass logo" width={50} height={50} />
            </div>
            <div className="item-body" >
              <h2 style={{textAlign:'center'}}>Thanks for shopping with us!</h2>
              <p style={{textAlign:'center'}}>We have added your order to your order history</p>
              {/* <button style={{textAlign:'center',display:'block',margin:"0 auto"}} onClick={() => orderAgain()}>Order Again</button> */}
            </div>
          </section>
        )}

        {userData && !finishedOrder && (
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
        )}
         {/* : !finishedOrder && (
          <form onSubmit={handleSubmit}>
            {loading && <p>Loading...</p>}
            {errors && <p style={{color: 'red', opacity: 0.8}}>{errors.toString()}</p>}
            <label htmlFor="user-id">User ID</label>
            <input id="user-id" name="user-id" type="text" required value={userId} onChange={handleChange} />
            <button type="submit" disabled={loading}>Submit</button>
          </form>
        )} */}
      </main>
    </div>
  )
}
