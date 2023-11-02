const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true,
        default: 'student'
    },
    falcuty: {
        type: String,
        default: ''
    },
    class: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: 'https://i.stack.imgur.com/l60Hf.png'
    }
})
UserSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', UserSchema)