import mongoose from 'mongoose'
import { MenuSchema } from './Menu'
import { OrderSchema } from './Orders'

const UserSchema = new mongoose.Schema({
  id: { type: String },
  data: {
    id: { type: String },
    name: { type: String, default: "" },
    frequent: MenuSchema
  },
  cart: [ MenuSchema ],
  favorite: [ MenuSchema ],
  history: [ OrderSchema ]
})

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
