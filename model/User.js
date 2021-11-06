import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  id: { type: String }
})

mongoose.models = {}

const UserModel = mongoose.model('Users', UserSchema)

export default UserModel;
