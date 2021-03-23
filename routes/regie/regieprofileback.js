const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );

const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});

router.post('/upload', upload.single('photo'), (req, res) => {
    console.log('what file isit', req.file );
    if(req.file){
        res.end( req.file.filename );
    }
    else throw 'error';
});

module.exports = {


}