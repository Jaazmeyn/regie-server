const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können
//const fillSitewithIndividualUserdata = require(__dirname + '/../individualdash')

router.get('/', (req, res) => {
    //res.redirect('login.html');
    res.sendFile(__dirname + '/templates/dashboard.html')
})

//router.use('/:id', fillSitewithIndividualUserdata)

module.exports = router;