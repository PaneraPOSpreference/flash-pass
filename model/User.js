import mongoose from 'mongoose'
import { MenuSchema } from './Menu'

const UserSchema = new mongoose.Schema({
  id: { type: String },
  data: {
    id: { type: String },
    name: { type: String, default: "" },
    frequent: MenuSchema
  },
  favorite: [ MenuSchema ],
  history: [
    {
      menuItem: MenuSchema,
      timestamp: { type: Date, default: Date.now() }
    }
  ]
})

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
