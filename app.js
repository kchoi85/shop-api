const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');

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