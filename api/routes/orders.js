const express = require('express');
const router = express.Router();

/*
    Our API
    -/products [GET, POST]
    -/products/{id} [GET, PATCH, DELETE]
    -/orders [GET, POST]
    -/orders{id} [GET, DELETE]
*/

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});


router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Orders was created'
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order was fetched',
        order: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order was deleted!',
        order: req.params.orderId
    });
});


module.exports = router;