import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
// import classNames from "classnames"
import styled from 'styled-components'
import styles from '../styles/Home.module.css'
import logo from '../public/logo.svg'
import ConnectPusher from '../components/ConnectPusher'
import {menuItems as mockMenuItems, menu as menuData} from '../mocks/menu'
import { ItemsGridSection } from '../components/ItemsGridSection'
import colors from '../styles/colors'

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

  // let categories = menuData.categories;

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
    // insert "order" into 4th position of categories
    // let nextCategories = categories.splice(3, 0, "order")
    // console.log('nextCategories:', nextCategories, 'categories:', categories)
  }, [])

  useEffect(() => {
    console.log('menu items change:', menuItems)
  }, [menuItems])

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
    const item = menuItems.find(item_r => item_r.id === itemId)
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

  // const removeItemFromOrder = (itemId) => {
  //   console.log('removing item with id:', itemId, 'from order')
  //   const newOrder = order.filter(item => item.id !== itemId)
  //   setOrder(newOrder)
  // }

  const purchaseOrder = () => {
    console.log('purchasing order')

    setFinishedOrder(true)
    setShowMenu(false)

    console.log('order:', order)

    setTimeout(() => {
      setOrder([])
      setFinishedOrder(false)
      setShowMenu(true)
    }, 5000)

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

  // const orderAgain = () => {
  //   setShowMenu(true)
  //   setFinishedOrder(false)
  //   setActiveMenuItemId(null)
  // }

  // const clearUser = () => {
  //   setUserData(null)
  //   setLoading(false)
  //   setErrors(null)
  //   setActiveMenuItemId(null)
  //   setUserId("")
  //   setFinishedOrder(false)
  // }

  return (
    <div className={styles.container}>
      <Head>
        <title>Bread Pass | Tiger Hacks 2021</title>
        <meta name="description" content="Order your favorite Panera items more easily than ever!" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main className={styles.main} style={{position: 'relative'}}>
        <h1 className="title-text"><Image src={logo} alt="flash pass logo" height={32} width={32} /> Bread Pass</h1>
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
        {(!finishedOrder && order) && (
          <StyledMenuLayout>
            <div className="left-col">
              <div className="menu-section">
                <h4 className="menu-section-header fancy"><span>{menuData.categories[1]}</span></h4>
                <ItemsGridSection menuItems={menuItems.filter(item => item.category === menuData.categories[1]).map(item => ({...item, imageSrc: `/panera-images/${menuData.imageSources[1]}`}))} handleMenuItemClick={handleMenuItemClick} />
              </div>
              <div className="menu-section">
                <h4 className="menu-section-header fancy"><span>{menuData.categories[2]}</span></h4>
                <ItemsGridSection menuItems={menuItems.filter(item => item.category === menuData.categories[2]).map(item => ({...item, imageSrc: `/panera-images/${menuData.imageSources[2]}`}))} handleMenuItemClick={handleMenuItemClick} />
              </div>
            </div>
            <div className="mid-col">
              <div className="menu-section">
                <h4 className="menu-section-header fancy fancy-2"><span>{menuData.categories[0]}</span></h4>
                <ItemsGridSection menuItems={menuItems.filter(item => item.category === menuData.categories[0]).map(item => ({...item, imageSrc: `/panera-images/${menuData.imageSources[0]}`}))} handleMenuItemClick={handleMenuItemClick} />
              </div>

              {/* Order Window */}
              <StyledOrders>
                <h3 className="orders-header">{userData ? `Welcome back, ${userData.name || "Guest"}` : "Your Order:"}</h3>
                <ul className="orders-list">
                  {order.length > 0 && order.map((orderItem, index) => (
                    <li className="order-item" key={`${index}-${orderItem.name}`}>
                      <h4 className="order-item-text">#{orderItem.id} - {orderItem.name}</h4>
                      <p className="order-item-price">${orderItem.price.toString()}</p>
                    </li>
                  ))}
                </ul>
    
                <div className="total-container">
                  <h4 style={{marginBottom:0,marginTop:0, marginRight: 20}}>Total:</h4>
                  <h4 style={{marginBottom:0,marginTop:0}}>${order.length < 0 ? 0 : order.reduce((acc, curr) => acc + Number(curr.price), 0)}</h4>
                </div>
              </StyledOrders>
            </div>
            <div className="right-col">
              <div className="menu-section">
                <h4 className="menu-section-header fancy"><span>{menuData.categories[3]}</span></h4>
                <ItemsGridSection menuItems={menuItems.filter(item => item.category === menuData.categories[3]).map(item => ({...item, imageSrc: `/panera-images/${menuData.imageSources[3]}`}))} handleMenuItemClick={handleMenuItemClick} />
              </div>
              <div className="menu-section">
                <h4 className="menu-section-header fancy"><span>{menuData.categories[4]}</span></h4>
                <ItemsGridSection menuItems={menuItems.filter(item => item.category === menuData.categories[4]).map(item => ({...item, imageSrc: `/panera-images/${menuData.imageSources[4]}`}))} handleMenuItemClick={handleMenuItemClick} />
              </div>
            </div>
          </StyledMenuLayout>
        )}
        
        {showMenu && activeMenuItemId && (
          <div style={{cursor: "pointer", marginBottom: 30}}>
            <button onClick={() => addItemToOrder(activeMenuItemId)}>Add {menuItems.find(item => item.id === activeMenuItemId).name} to order for ${menuItems.find(item => item.id === activeMenuItemId).price}</button>
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
              {/* <div className="order-details">
                <p>Order Details:</p>
                <ul style={{listStyle:'none'}}>
                  {order.length > 0 && order.map((orderItem, index) => (
                    <li className="order-item" key={`${index}-${orderItem.name}`}>
                      <h4 className="order-item-text">#{orderItem.id} - {orderItem.name}</h4>
                      <p className="order-item-price">${orderItem.price.toString()}</p>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          </section>
        )}

        {userData && !finishedOrder && (
          <div>
            
            <section>
              <p>Your order history:</p>
              <OrdersHistory>
                {userData.orders?.map(order => (
                  <li key={order.id}>
                    <p>{order.items.map(item => item.name).join(", ")}</p>
                    <p>{order.total}</p>
                  </li>
                ))}
              </OrdersHistory>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}


const StyledOrders = styled.section`
  padding: 0px;
  margin: 0px 20px;
  padding-left: 10%;
  padding-right: 10%;

  .orders-header {
    text-align:center;
    font-size:1.75rem;
  }
  .orders-list {
    list-style: none;
    padding: 0px;
  }
  .order-item {
    margin-bottom: 8px;
    margin-top:8px;
    border-bottom:1px solid rgba(33,33,33,.1);
    display:flex;
    align-items:center;
    padding: 10px 5px;
  }
  .order-item-text {
    flex:1;
    margin-bottom:0px;
    margin-top:0px;
  }
  .order-item-price {
    margin-left: 10px;
    margin-bottom:0px;
    margin-top:0px;
  }

  .total-container {
    display:flex;
    justify-content:center;
    align-items: center;
    text-align: center;
    margin-top:40px;

    h4 {
      font-size: 1.35rem;
    }
  }

  @media(max-width: 768px) {
    padding: 0px;
    margin: 0px 10px;
    padding-left: 0px;
    padding-right: 0px;
  }
`
const OrdersHistory = styled.ul`
  list-style: none;
  padding: 0px;
`
const StyledMenuLayout = styled.div`
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;

  // grid logic
  /* max-width: 1200px; */
  /* margin: 0 auto; */
  /* display: grid; */
  /* grid-gap: 1rem; */
  /* grid-template-columns: 1fr 1fr 1fr; */
  /* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */

  .fancy {
    line-height: 0.5;
    text-align: center;
  }
  .fancy span {
    display: inline-block;
    position: relative;  
  }
  .fancy span:before,
  .fancy span:after {
    content: "";
    position: absolute;
    /* height: 5px; */
    border-bottom: 1px solid ${colors.green};
    border-top: 1px solid ${colors.green};
    top: 0;
    width: 50%; // calc((100vw - 20px) / 8);
  }
  .fancy span:before {
    right: 100%;
    margin-right: 15px;
  }
  .fancy span:after {
    left: 100%;
    margin-left: 15px;
  }

  .left-col {
    width: 25%;
    float: left;
  }
  .menu-section .styled-grid {
    justify-content: center !important;
  }
  .mid-col {
    width: 50%;
    float: left;

    .menu-section {
      margin-bottom: 40px;
    }
  }
  .right-col {
    width: 25%;
    float: right;
  }

  .menu-section {
    /* height: 4rem; */
    margin: 0px auto;

    .menu-section-header {
      font-family: 'panera';
      font-size: 1.75rem;
      font-weight: 500;
      margin-bottom: 25px;
      text-align: center;
    }
  }

  @media (min-width: 300px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: 1fr 2fr 1fr;
  }
`