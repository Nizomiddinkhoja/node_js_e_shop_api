const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const api = process.env.API_URL;
const uploadsPath = process.env.UPLOADS_PATH;
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

//middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(authJwt());
app.use(errorHandler);
app.use(uploadsPath, express.static(__dirname + uploadsPath));

// database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_STRING)
    .then()
    .catch((err) => console.log(err));

//routers
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

// routes
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

app.listen(3000);