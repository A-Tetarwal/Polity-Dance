const mongoose = require('mongoose');

// mongoose.connect(`mongodb://127.0.0.1:27017/polity-dance`);

mongoose.connect('mongodb+srv://andashishwill:TaYqsieq2nWxyS6S@cluster0.gnkko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  }).then(() => {
    console.log('Connected to MongoDB Atlas');
  }).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });

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
    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'article'
        }
    ]
})

console.log('mongodb connected');
module.exports = mongoose.model('user', userSchema);