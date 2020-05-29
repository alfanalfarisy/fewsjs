var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  no: { type: String, required: true },
  firstname: String,
  lastname: String,
  admin: Boolean,
},
{
    timestamps: true
});

var Users = mongoose.model('User', userSchema);

module.exports = Users;