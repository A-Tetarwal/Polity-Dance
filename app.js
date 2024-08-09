const express = require('express');
const app = express();

const userModel = require(`./models/user`);
const postModel = require(`./models/post`);

const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
// multeconfig import kr rhe hain
const upload = require('./configs/multerconfig');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/rhyme/tech', (req, res) => {
    res.render('tech');
})

app.get('/login', (req, res) => {
    // 423@filmiIndian
    res.render('login');
})
app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { username, name, email, age, password } = req.body;
    // pehle user check krenge
    let user = await userModel.findOne({ email })
    // agar user mila toh create nhi krenge
    if (user) return res.status(500).send('User already exists');
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username, name, email, age, password: hash
            })
            // jo bhi banaya hai uska email aur userid save krenge token bhejne ke liye
            let token = jwt.sign({ email: email, userid: user._id }, 'securekey')
            res.cookie("token", token);
            // res.send('User registered');
            res.redirect(`/p/${user.username}`)
        })
    })
})

app.post('/login', async (req, res) => {
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send(`User doesn't exists`);

    bcrypt.compare(password, user.password, (err, result) => {
        if(result){
            let token = jwt.sign({ email: email, userid: user._id }, 'securekey')
            res.cookie("token", token);
            // res.status(200).send('you can login');
            res.redirect(`/home`)
        }
        else res.redirect('/login')
    })
})

app.get('/logout', (req, res) => {
    res.cookie('token', '');
    res.redirect('login')
})

// middleware for protected routes
function isLoggedIn(req, res, next) {
    // if(req.cookies.token === '') res.send('please login');
    if(req.cookies.token === '') res.redirect('login');
    else {
        let data = jwt.verify(req.cookies.token, 'securekey')
        req.user = data;
        next();
    }
}

app.get('/p/:username', isLoggedIn, async (req, res) => {
    let username = req.params.username;
    // Now you can use the username to find the user and their posts
    let user = await userModel.findOne({ username: username }).populate("posts");
    res.render('profile', { user });
})

app.get('/createpost', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}) // ye req.user.email ooper isLogedIn se aa rha hai
    res.render('createpost', {user}); // profile ejs pe humne user ko send kr diya hai
})

app.post('/createpost', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});

    let {content} = req.body;
    let post = await postModel.create({content, user: user._id});

    await user.posts.push(post._id);
    await user.save();
    res.redirect(`/p/${user.username}`)
})

app.get('/editp', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    res.render('editprofile', {user})
})

app.post('/editp', isLoggedIn, upload.single('image'), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.about = req.body.about; // update the user's about field
    if(req.file){
        user.profilepic = req.file.filename;
    }
    await user.save(); // save the changes
    res.redirect(`/p/${user.username}`)
})

app.get('/home', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({email: req.user.email})
    const posts = await postModel.find().sort({ date: -1 }).populate('user'); // Assuming you have an user field
    res.render('home', { posts, user });
});


app.listen(3000, () => console.log('server running on 3000'));