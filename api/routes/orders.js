const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

/*
    Our API
    -/products [GET, POST]
    -/products/{id} [GET, PATCH, DELETE]
    -/orders [GET, POST]
    -/orders{id} [GET, DELETE]
*/

router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name') //populates query: product, if ',' is passed as 2nd param, we select for those
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                }),
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
});

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found!'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Order stored (POST handling successful)",
                        createdOrder: {
                            _id: result._id,
                            product: result.productId,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + result._id
                        }
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // }
    // res.status(201).json({
    //     message: 'Orders was created',
    //     order: order
    // });
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(doc => {
        if (!doc) {
            return res.status(404).json({
                message: 'Order not found!'
            })
        }
        console.log("From database ", doc);
        if (doc) { //if doc is found in db, then res 200
            res.status(200).json({
                _id: doc._id,
                product: doc.product,
                quantity: doc.quantity
            });
        } 
    })
    .catch(err => { // if id is not valid at all
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/orders/',
                    body: { productId: "Id", quantity: "Number"}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});


module.exports = router;