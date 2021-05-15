const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// #6 
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://mongo:' + 
        process.env.MONGO_ATLAS_PW + 
        '@cluster0.kxpu2.mongodb.net/shop-api?retryWrites=true&w=majority', 
);
//mongoose.connect('mongodb+srv://mongo:Zjsxyks9!@cluster0.kxpu2.mongodb.net/shop-api?retryWrites=true&w=majority')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');

/*  Cors - Cross-Origin Resource Sharing
    Client = localhost:4000
    Server = localhost:3000
    -sending *headers* from the server to the client (to give access)
*/

// Before any Routes, we send headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
// middleware, incoming request must go through app.use()
app.use('/products', productRoutes); // if we pass /products, we go to product.js, which we did router.get('/');
app.use('/orders', orderRoutes);

// if we reach here (after above 2 routes, means no routes were able to handle the request)
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; //404 error by definition is no fitting route
    next(error); //forward the error request
})

// Operations in the DB can fail (the above will not handle)
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;