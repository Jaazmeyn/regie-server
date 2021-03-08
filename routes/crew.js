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
router.post('/', (req, res) => {//vom frontend to server gesendet
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
            console.log('was isn das??', data)
        })
        res.status(200)
        .set({'Content-Type':'application/json' } )
        .end(JSON.stringify({status:'success'}));  
    }) //ende readfile
})//end post crew registrierung


/** LOGIN  
 * crewmember Anmeldung
 * abchecken ob user und passwort in json vorhanden sind
 * */
router.get('/', (req, res) => { 
     console.log( 'anfrage get kommt an')
     loginname = req.body.vorname,
     loginpw = req.body.password
     console.log(loginname, loginpw)

    fs.readFile(CrewFile, (err, memberdata) => { 
        if(!err){
            memberdata = JSON.stringify(memberdata), 
            memberdata.crewMembers.forEach(one => {
                // console.log(one.vorname, 'all names')
                if(loginname === one.vorname && loginpw === one.password){
                    console.log('existing user');
                } else {
                    console.log('not existing user');
                }
            })

            memberdata.crewMembers.map(onemember(()=>{
                console.log(loginpw)
            }))
            // memberdata = JSON.parse(memberdata), 
            // console.log(memberdata)
            //  password = data.login.password,
         } 
        else { // error bei file lesen
            console.log('eintragung fehlgeschlagen!')
        }   
        res.status(200)
        .set({'Content-Type':'application/json' } )
        .end(JSON.stringify({status:'success'}));    
    }) //end readfile
})//end get

module.exports = router;