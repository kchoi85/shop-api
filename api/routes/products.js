const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/product');

const multer = require('multer') // body parser for parsing form data
// multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

// fileFilter param for multer
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); //accept file
    } else {
        cb(null, false); //reject file
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5 //5mb
    },
    fileFilter: fileFilter
});

/*
    Our API
    -/products [GET, POST]
    -/products/{id} [GET, PATCH, DELETE]
    -/orders [GET, POST]
    -/orders{id} [GET, DELETE]
*/

router.get('/', (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/' + doc._id,
                        body: { name: "String", price: "Number"}
                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }; 
    console.log(req.file); // multer

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:  req.file.path //multer file path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Created product successfully (Handling POST requests to /products)',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id : result._id,
                    productImage: result.productImage,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
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
                res.status(200).json({
                    message: 'Fetched product: ' + doc.name,
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage
                });
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
    const id = req.params.productId;
    const updateOps = {}; //object
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    //console.log(updateOps);

// [ -> req.body = an array
//   {"propName": "name", "value": "Product 1->2"},
//   {"propName": "price", "value": "3.99"}
// ]

    Product.updateOne({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product" + result._id + "successfully patched",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    // res.status(200).json({
    //     message: 'Updated product!'
    // });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number'} 
                }
            });
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