const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können

/**
 * crewmember  -- endpoint '/crew'
 * Registrierung -- (json file: crew)
 */    
const CrewFile = __dirname + '/../model/data/crew.json';

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/register.html');
})
//main.js (ajax) sendet user im body mit
router.post('/', (req, res) => {//neuer user vom frontend gesendet
    let newCrewMember = {
        vorname: req.body.vorname,
        nachname: req.body.nachname,
        email : req.body.email, 
        password: req.body.password,
        number : req.body.number,
        id : req.body.id,
        projectsId: req.body.projectsId,
        status : req.body.login
    }
    console.log('postrequest kommt an',req.body);
    //speicher registrierten in JSON file
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data), //in js object waneln
            //crewmember in Array als objekt fügen
            data.crewMembers.push(newCrewMember); //crewmembers im json 
            console.log('eintragung erfolgreich!')
   

        } else { // error bei file lesen
            console.log('eintragung fehlgeschlagen!', data)
        }
            // res end -> neue daten überschreiben
        fs.writeFile(CrewFile, JSON.stringify(data), (err) => {
            console.log('last user', data)
        })
        res.status(200)
            .set({'Content-Type':'application/json' } )
            .send(JSON.stringify(data)) //in json string
    }) 
})//end post crew registrierung

module.exports = router;