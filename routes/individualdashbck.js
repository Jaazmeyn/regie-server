const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
const { data } = require('jquery');
router.use( bodyParser.json() );

const ProjectDB = __dirname + '/../model/data/projects.json';
const CrewFile = __dirname + '/../model/data/crew.json';

// alle user
// nach login email suchen und dadurch auf die id
// wie komme ich zu loginMail?
router.get('/', (req, res)=>{
    let logiEmail = req.body;

});
if(loginEmail == data.user.mail){
    loginEmail[index]
}
//ajax user:/id
//finde zu jedem eingeloggden passende id
//
//ajax projects






module.exports = router;