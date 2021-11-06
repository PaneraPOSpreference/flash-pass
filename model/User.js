import mongoose from 'mongoose'
import MenuModel from 'Menu'

const UserSchema = new mongoose.Schema({
  data: {
    id: { type: String },
    name: { type: String, default: "" }
  },
  favorite: [ MenuModel ],
  history: [
    {
      menuItem: { MenuModel },
      timestamp: { type: Date }
    }
  ]
})

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
