const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String },
  id: { type: Number}
})


const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel;
