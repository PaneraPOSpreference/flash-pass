const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  id: { type: String }
})


const UserModel = mongoose.model('Users', UserSchema)

module.exports = UserModel;
