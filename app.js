const express = require('express');
const app = express();
const { urlencoded, json } = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { resolve } = require('path');
const { config, uploader } = require('cloudinary').v2;
const { multerUploads, dataUri } = require('./configs/multer.js');
const { multerUploadds, dataUUri } = require('./configs/multer2.js');
const path = require('path');  // Add this line

const serverless = require('serverless-http');

const userModel = require(`./models/user.js`);
const articleModel = require(`./models/article.js`);


// app.set('view engine', 'ejs');
// app.use(express.static(resolve(__dirname, 'public')));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cloudinary configuration
config({
    cloud_name: 'dy4izbbfp',
    api_key: '247199398793383',
    api_secret: 'CL4cfIr4Llvg3Wg8SSD4OhLlkbs'
});

// Serve the index.html for all routes not matched by specific routes
// app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname, '../public/index')));  // Now path is defined

app.get('/', async (req, res) => {
    const articles = await articleModel.find().sort({ date: -1 }).populate('user'); // Assuming you have an user field
    res.render('index', {articles});
});

app.get('/tech', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    const articles = await articleModel.find().sort({ date: -1 }).populate('user'); // Assuming you have an user field
    res.render('tech', {articles, user});
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, name, email, age, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.status(500).send('User already exists');
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({ username, name, email, age, password: hash });
            let token = jwt.sign({ email: email, userid: user._id }, 'securekey');
            res.cookie("token", token);
            res.redirect(`/p/${user.username}`);
        });
    });
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send(`User doesn't exist`);

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, 'securekey');
            res.cookie("token", token);
            res.redirect(`/home`);
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    res.cookie('token', '');
    res.redirect('/login');
});

// Middleware for protected routes
function isLoggedIn(req, res, next) {
    if (!req.cookies.token) return res.render('login');
    try {
        let data = jwt.verify(req.cookies.token, 'securekey');
        req.user = data;
        next();
    } catch (err) {
        return res.render('login');
    }
}

app.get('/p/:username', isLoggedIn, async (req, res) => {
    let username = req.params.username;
    let user = await userModel.findOne({ username: username }).populate("articles");
    res.render('profile', { user });
});

app.get('/pAll/:username', async (req, res) => {
    let username = req.params.username;
    let user = await userModel.findOne({ username: username }).populate("articles");
    res.render('profileAll', { user });
});

app.get('/createarticle', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    res.render('createarticle', { user });
});

const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2; // Ensure you have cloudinary set up

app.post('/createarticle', isLoggedIn, multerUploadds, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { title, content } = req.body;

    console.log("Uploaded file: ", req.file); // Inspect the file object

    if (req.file) {
        const fileStream = streamifier.createReadStream(req.file.buffer); // Convert buffer to stream

        try {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }).end(req.file.buffer); // End the stream with the file buffer
            });

            console.log("Upload result: ", result);

            const articlePic = result.url;

            let article = await articleModel.create({ title, content, user: user._id, articlePic });
            user.articles.push(article._id);
            await user.save();

            res.redirect(`/p/${user.username}`);
        } catch (err) {
            console.error("Upload error: ", err);
            return res.status(400).json({ message: 'Something went wrong while processing your request', data: { err } });
        }
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});


app.get('/editprofile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    res.render('editprofile', { user });
});

app.post('/editprofile', isLoggedIn, multerUploads, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.about = req.body.about;
    
    if (req.file) {
        const file = dataUri(req).content;
        try {
            const result = await uploader.upload(file);
            const image = result.url;
            user.profilepic = image;
        } catch (err) {
            return res.status(400).json({ message: 'Something went wrong while processing your request', data: { err } });
        }
    }

    await user.save();
    res.redirect(`/p/${user.username}`);
});

app.get('/home', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });
    const articles = await articleModel.find().sort({ date: -1 }).populate('user');
    res.render('tech', { articles, user });
});

app.get('/articles/:username/:title', async (req, res) => {
    let username = req.params.username;
    let title = req.params.title;

    try {
        // Find the user by email
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the article by title associated with the user
        const article = await articleModel.findOne({ title: title, user: user._id });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // If the article is found, render it or send it as JSON
        res.render('article', { article, user }); // Assuming you have an 'articleDetail' view to render the article
        // Or if you want to return JSON data
        // res.json({ article });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.get('/p/articles/:username/:title', async (req, res) => {
    let username = req.params.username;
    let title = req.params.title;

    try {
        // Find the user by email
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the article by title associated with the user
        const article = await articleModel.findOne({ title: title, user: user._id });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // If the article is found, render it or send it as JSON
        res.render('article', { article, user }); // Assuming you have an 'articleDetail' view to render the article
        // Or if you want to return JSON data
        // res.json({ article });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));

// Export the app for Vercel
module.exports = app;
module.exports.handler = serverless(app);
