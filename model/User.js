import mongoose from 'mongoose'
import MenuItem from 'MenuItem'

const UserSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  id: { type: String }
})

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
