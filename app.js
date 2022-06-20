const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const dotenv = require('dotenv');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // cb(null, uuidv4());
        cb(null, new Date().getTime() + file.originalname);

    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json()); // application-json
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).array('image', 6));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*'); // * - set to all url and domains
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/feed', feedRoutes);
app.use('/api/auth', authRoutes);

app.use((error, req, res, next) => {
   console.log(error);
   const status = error.statusCode || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({
       message: message,
       data: data
   }); 
});

mongoose.connect(process.env.MONGO_URL)
.then(result => {
    app.listen(process.env.PORT || 8080);   
})
.catch(err => {
    console.log(err);
});
