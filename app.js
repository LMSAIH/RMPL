const express = require('express');
require('dotenv').config();
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');
const session = require('express-session');


const app = express();
const PORT =  process.env.PORT || 5000;

connectDB();
//middleware to sustain the app 
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'Super secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
}));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', require('./server/routes/main'));

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
});




