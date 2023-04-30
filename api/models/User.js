const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    names: String,
    email: {type:String, unique:true, index: true},
    password: String,
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;