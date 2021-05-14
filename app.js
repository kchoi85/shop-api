const express = require('express');
const app = express();

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');

// middleware, incoming request must go through app.use()
app.use('/products', productRoutes); // if we pass /products, we go to product.js, which we did router.get('/');
app.use('/orders', orderRoutes);

module.exports = app;