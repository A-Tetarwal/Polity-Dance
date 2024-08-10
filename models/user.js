const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/polity-dance`);

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    profilepic: {
        type: String,
        default: 'default.jpg'
    },
    about: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
})

console.log('mongodb connected');
module.exports = mongoose.model('user', userSchema);