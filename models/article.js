const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default:Date.now()
    },
    content: String,
    articlePic: String, // Added articlePic field
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

module.exports = mongoose.model('article', articleSchema);