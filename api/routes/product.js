const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/product');

/*
    Our API
    -/products [GET, POST]
    -/products/{id} [GET, PATCH, DELETE]
    -/orders [GET, POST]
    -/orders{id} [GET, DELETE]
*/

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
});

router.post('/', (req, res, next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }; 
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Handling POST requests to /products',
                createdProduct: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });


});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database ", doc);
            if (doc) { //if doc is found in db, then res 200
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'})
            }
        })
        .catch(err => { // if id is not valid at all
            console.log(err);
            res.status(500).json({error: err});
        });

    // const id = req.params.productId;
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: "You've discovered the special ID",
    //         id: id
    //     });
    // } else {
    //     res.status(200).json({
    //         message: "You passed an ID"
    //     })
    // }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    // res.status(200).json({
    //     message: 'Deleted product!'
    // });
});

module.exports = router;