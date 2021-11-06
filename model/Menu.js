import mongoose from 'mongoose'

const MenuSchema = new mongoose.Schema({
  name: { type: String },
  id: { type: String },
  type: [
    { type: String }
  ],
  category: { type: String },
  price: { type: String }
})

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
