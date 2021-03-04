const fs = require('fs');//um auf datein zugreifen
const express = require('express');
const app = express();

const bodyParser = require( 'body-parser' );


// HEROKU SERVER: ENV nummer:
const PORT = process.env.PORT || 5555;
const server = app.listen( PORT , _=> {
    console.log( `Server läuft auf Port ${PORT}` )
})

const morgan = require( 'morgan' ); //protkollieren login user connected serverprotokoll (npm install morgan)
app.use( morgan( ':url :method :status :remote-addr' ) ); //basis configurationen

app.use( bodyParser.json() );//um daten aus body auslesen zu können

//default abfangen .. muss in den anderen ordner kommen
app.use( express.static('static'));

/**
 * crewmember  -- endpoint '/crew'
 * Registrierung -- (json file: crew)
 */    
const CrewFile = 'model/data/crew.json';

app.get('/regie', function (req, res) {
    res.send('static/regie.html');
  });

//main.js (ajax) sendet user im body mit
app.post('/crew', (req, res) => {//wenn user form absendet bekomme request an diese url
    let newCrewMember = req.body;
    console.log('postrequest kommt an', req,'req');

    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data), 
            //console.log('data',data),
            //crewmember in Array als objekt fügen
            data.crewMembers.push(newCrewMember); //crewmembers im json 

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
})//end post crew registrierung


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
          if(!err){
                 data = JSON.parse(data)
                 console.log(data, 'logindata')
          }
            else {
                console.log('datenabfrage fehlgeschlagen')
            }
            
            fs.writeFile(CrewFile, JSON.stringify(data), (err) => {
                req.status(200)
                    .set({'Content-Type':'application/json'})
                    .end(JSON.stringify({status:'success'}));
            })
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

  