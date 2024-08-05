const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 5000 || process.env.PORT;
const expressLayout = require('express-ejs-layouts');

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', require('./server/routes/main'));

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
});

app.get('/', (req,res) => {
    res.send("<h1>Hello</h1>");
    console.log("request received");
    console.log(process.env.NAME);
});


