const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const PostsSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    Owner: {
        type: String,
        require: true
    }
})
PostsSchema.plugin(findOrCreate);
module.exports = mongoose.model('Posts', PostsSchema)
