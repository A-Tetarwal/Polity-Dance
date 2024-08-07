const express = require('express');
const app = express();

// Set 'ejs' as the view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index'); // Ensure there is an 'index.ejs' file in your 'views' directory
});

app.listen(3000, () => {
    console.log('server running on http://localhost:3000');
});
