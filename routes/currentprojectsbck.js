const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
const { json } = require('body-parser');
router.use( bodyParser.json() );//um daten aus body auslesen zu können



const ProjectDB = __dirname + '/../model/data/projects.json';
const CrewFile = __dirname + '/../model/data/crew.json';






module.exports = router;