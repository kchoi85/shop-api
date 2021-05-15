# shop-api :shopping:
Node.js Template App For Local Grocery Stores

## API Routes
- /products [GET, POST]
- /products/{id} [GET, PATCH, DELETE]
- /orders [GET, POST]
- /orders{id} [GET, DELETE]

## Server Logging 
- morgan (https://www.npmjs.com/package/morgan)

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
