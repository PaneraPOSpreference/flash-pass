import mongoose from 'mongoose'
import { MenuSchema } from './Menu'

export const OrderSchema = new mongoose.Schema({
  items: [ MenuSchema ],
  price: { type: Number, default: 0 },
  timestamp: {
    start: { type: Date },
    end: { type: Date }
  },
  id: { type: Number}
})

export default mongoose.models.Orders || mongoose.model('Orders', OrderSchema);
