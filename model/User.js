import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  id: { type: String },
  // favorite: [
  //   {
  //     menuItem: {type: MenuItem}
  //   }
  // ],
  // history: [
  //   {
  //     itemId: { type:  },
  //     timestamp: { type: Date }
  //   }
  // ]
})

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
