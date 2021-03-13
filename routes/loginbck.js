const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können

const CrewFile = __dirname + '/../model/data/crew.json';


//wenn eingabe im browser auf login
router.get('/', (req, res) => {
    //res.redirect('login.html');
    res.sendFile(__dirname + '/templates/login.html')
})

router.post('/', (req, res) => {//vom frontend to server gesendet
    let newCrewMember = {
        email: req.body.email,
        password: req.body.password,
    }
    console.log('postrequest kommt an',newCrewMember);
    //speicher registrierten in JSON file
   
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data); /*all users */ 
            console.log(data)
            let e;
            let existingUser = data.crewMembers.find(e => { //
               return e.email == newCrewMember.email && e.password == newCrewMember.password
            })
            data = {login:existingUser}
            console.log('user durchsuchen erfolgreich!')
        } else { // error bei file lesen
            console.log('durchsuchen fehlgeschlagen!')
        }
        res.status(200)
            .set({'Content-Type':'application/json' } )
            .end(JSON.stringify(data));  //antwort sucess  
    }) //ende readfile
})//end post crew login

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