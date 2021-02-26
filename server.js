const fs = require('fs');//um auf datein zugreifen
const express = require('express');
const app = express();

const ordnername = '/mvc';
//const mvcModul = require(__dirmname + ordnername); // ordner daraus index
// const path = require('path'); für middleware app.use( express.static(Path.join(__dirname, 'view')));
const bodyParser = require( 'body-parser' );


// HEROKU SERVER: ENV nummer:
const PORT = process.env.PORT || 5555;

const server = app.listen( PORT , _=> {
    console.log( `Server läuft auf Port ${PORT}` )
})
// lade verbindung (wie speichere ich daten am server)(1möglichkeit daten zu speichern mit db klasse simuliert wobei im hintergrund eine json datei befüllt wird-> sonst sqlight version
const db = require( __dirname + '/model/db.js' ); 

const morgan = require( 'morgan' ); //protkollieren login user connected serverprotokoll (npm install morgan)
app.use( morgan( ':url :method :status :remote-addr' ) ); //basis configurationen

// Formdata: app.use( bodyParser.urlencoded({extended: false}) );//-> daten umgewandelt
app.use( bodyParser.json() );//um get body zu encoden

//default abfangen .. muss in den anderen ordner kommen
//express.static(__dirname[])
app.use( express.static('static'));

/**
 * crewmember  -- endpoint '/crew'
 *
 * Registrierung -- (json file: crew)
 */    


const CrewFile = 'model/data/crew.json';

// const EventEmitter = require('events');
// const Eventemitter = require('events');
// let UserEvents = new EventEmitter();
// //event nur einmal ausführen -> eventlistener
// UserEvents.once('register', () => { //funktion wartet auf auslöser(frontend onclick)
    //nach registrierung
    app.post('/crew', (req, res) => {//wenn user form absendet bekomme request an diese url
        console.log('postrequest kommt an', req.body);
        let newCrewMember = req.body;
        let cmEmail = newCrewMember.email; // new member from form

        fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
            if(!err){

                // ////  already existing user dont push!!!
                // data.forEach((member, data)=>{
                //     if(member.email == cmEmail){ //member im array email == neuer eintrag email array.includes same person
                //         console.log(crewMember.name + 'berreits registriert.')
                //     } else {
                        data = JSON.parse(data), 
                        console.log('dataaaaa',data),
                        //crewmember in Array als objekt fügen
                    data.crewMembers.push(newCrewMember); //crewmembers im json 
                //     }
                // })//ende foreach
            } else { // error bei file lesen
                console.log('eintragung fehlgeschlagen!')
            }
                // res end -> neue daten überschreiben
            fs.writeFile(CrewFile, JSON.stringify(data), (err) => {
                res.status(200)
                    .set({'Content-Type':'application/json'})
                    .end(JSON.stringify({status:'success'}));
            })
        }) //ende readfile
    
    //     // 1. wenn feld leer ist, eigentlich auch im frontend gemacht
    //     if( newCrewMember.name == ' ' || newCrewMember.pw == ' '){
    //         req.statusCode(404).send({
    //             message: 'keine leeren Felder!'})
    //     } // 2. wenn user vorhanden ist .contains()
    //     else {
    //         //db add user to json file
    //         res.end(JSON.stringify(newCrewMember))
    //     }

    })//end post crew registrierung


// })//end once register





/** LOGIN -> html muss noch gemacht werden
 * 
 * crewmember Anmeldung
 * abchecken ob user und passwort in json vorhanden sind
 *
 * datenbank nach crew members abfragen
 */
app.get('/crew', (req, res) => {
     console.log('anfrage GET kommt an')

    fs.readFile(CrewFile, (err, data) => { 
//         if(!err){
//             data = JSON.parse(data)
//         }
//         else {
//             console.log('datenabfrage fehlgeschlagen')
//         }
        
//         fs.writeFile(CrewFile, JSON.stringify(data), (err) => {
//             req.status(200)
//                 .set({'Content-Type':'application/json'})
//                 .end(JSON.stringify({status:'success'}));
//         })
   }) //end readfile
})//end get


/**
 * im Maintainerberreich nach login möglichkeit user löschen & editieren
 * 
 * bewerber löschen: app.delete('/bewerber/:id) || member
 * bewerber editieren app.put('/bewerber)   || member
 * bewerber als member zulassen: app.put( '') //url ändern..
 * 
 */

  