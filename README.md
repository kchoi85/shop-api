# shop-api :shopping:
The REST API is implemented as JSON over HTTP using all four verbs (GET/POST/PUT/DELETE). Each resource, like Order, Product, or Collection, has a distinct URL and is manipulated in isolation. In other words, I’ve tried to make the API follow the REST principles as much as possible.

## API Routes
- dev-s01edge.kihoon.lab.com/products [GET, POST]
- dev-s01edge.kihoon.lab.com/products/{:id} [GET, PATCH, DELETE]
- dev-s01edge.kihoon.lab.com/orders [GET, POST]
- dev-s01edge.kihoon.lab.com/orders{:id} [GET, DELETE]

## Server Logging 
- **morgan** (https://www.npmjs.com/package/morgan)
- **dotenv** (https://www.npmjs.com/package/dotenv)

## Handling CORS
```javascript
/*  CORS - Cross-Origin Resource Sharing
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
```

## Product Schema
```javascript
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productImage: {type: String, required: false}
});

module.exports = mongoose.model('Product', productSchema);
```

## Order Schema
```javascript
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);
```

## Uploading & Storing Image Files
```javascript
// app.js
app.use('/uploads', express.static('uploads'))

// products.js
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
```