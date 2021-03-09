const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können

const crew = [];
// router.get('/', (reg, res) => {

// })



/**
 * crewmember  -- endpoint '/crew'
 * Registrierung -- (json file: crew)
 */    
const CrewFile = './model/data/crew.json';

//main.js (ajax) sendet user im body mit
router.post('/register', (req, res) => {//vom frontend to server gesendet
    let newCrewMember = {
        vorname: req.body.vorname,
        nachname: req.body.nachname,
        email : req.body.email, 
        password: req.body.password,
        number : req.body.number,
        id : req.body.id,
        status : req.body.login
    }
    console.log('postrequest kommt an','req');
    //speicher registrierten in JSON file
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data), 
            //crewmember in Array als objekt fügen
            data.crewMembers.push(newCrewMember); //crewmembers im json 
            console.log('eintragung erfolgreich!')
        } else { // error bei file lesen
            console.log('eintragung fehlgeschlagen!')
        }
            // res end -> neue daten überschreiben
        fs.writeFile(CrewFile, JSON.stringify(data), (err) => {
            console.log('last user??', data)
        })

        res.status(200)
        .set({'Content-Type':'application/json' } )
        .end(JSON.stringify(data),  //antwort sucess
        ) //ende readfile
    }) 
})//end post crew registrierung

router.post('/login', (req, res) => {//vom frontend to server gesendet
    let newCrewMember = {
        email: req.body.email,
        password: req.body.password,
    }
    console.log('postrequest kommt an','req');
    //speicher registrierten in JSON file
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data);
            //crewmember in Array als objekt fügen
            //data.crewMembers.push(newCrewMember); //crewmembers im json 
            //usser?
            let existingUser = data.crewMembers.find(e => {
                return e.email == newCrewMember.email && e.password == newCrewMember.password;
            })
            data = {login:existingUser}
            console.log('eintragung erfolgreich!')
        } else { // error bei file lesen
            console.log('eintragung fehlgeschlagen!')
        }

        res.status(200)
        .set({'Content-Type':'application/json' } )
        .end(JSON.stringify(data),  //antwort sucess
        ) //ende readfile
    }) 
})//end post crew registrierung

/** LOGIN  
 * crewmember Anmeldung members auslesen
 * 
 * */
// router.get('/', (req, res) => { 
//      console.log( 'anfrage get kommt an')
     
//     //liest aus crewfile
//     fs.readFile(CrewFile, (err, data) => {  
//         res.status(200)
//         .set({'Content-Type':'application/json' } )
//         .end(JSON.parse(data));    
//     }) //end readfile
// })//end get

module.exports = router;