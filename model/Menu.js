import mongoose from 'mongoose'

export const MenuSchema = new mongoose.Schema({
  name: { type: String },
  id: { type: Number },
  type: [ String ],
  category: { type: String },
  price: { type: String }
})

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
