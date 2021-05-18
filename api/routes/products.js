const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

// Controller
const ProductController = require('../controllers/products');

const multer = require('multer') // body parser for parsing form data
// multer config (storage[destination, filename], limits, fileFilter)
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

router.get('/', ProductController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product);

router.get('/:productId', ProductController.products_get_product);

router.patch('/:productId', checkAuth, ProductController.products_update_product);

router.delete('/:productId', checkAuth, ProductController.products_delete_product);

module.exports = router;