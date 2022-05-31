const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const feedRoutes = require('./routes/feed');
dotenv.config();

const app = express();

app.use(bodyParser.json()); // application-json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*'); // * - set to all url and domains
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/feed', feedRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(result => {
    app.listen(process.env.PORT || 8080);   
})
.catch(err => {
    console.log(err);
});
