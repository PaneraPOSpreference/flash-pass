import { atom, selector } from 'recoil'
import { menuItems } from '../mocks/menu'

export const userDataState = atom({
  key: "user-data",
  default: null
})

export const menuItemsState = atom({
  key: "menu-items",
  default: menuItems
})

export const orderState = atom({
  key: "order-data",
  default: []
})

export const orderFinishedState = atom({
  key: "order-finished",
  default: false
})