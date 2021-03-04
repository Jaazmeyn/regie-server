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

// app.get('/regie', function (req, res) {
//     res.send('static/regie.html');
//   });

//main.js (ajax) sendet user im body mit
app.post('/crewregister', (req, res) => {//wenn user form absendet bekomme request an diese url
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


/** LOGIN  
 * crewmember Anmeldung
 * abchecken ob user und passwort in json vorhanden sind
 * */

app.post('/crewlogin', (req, res) => {
     console.log( 'anfrage post kommt an')
     loginname = req.body.vorname,
     loginpw = req.body.password
     console.log(loginname, loginpw)

    fs.readFile(CrewFile, (err, memberdata) => { 
        if(!err){
            memberdata = JSON.parse(memberdata), 
            // console.log(memberdata.crewMembers[0], 'erster')
            usernames = [];
            memberdata.crewMembers.map(one => {
                usernames = [];
                usernames.push(one.vorname)
                // console.log(one.vorname, 'all names')
                // console.log(loginname , ' = loginname')
                if(loginname === one.vorname && loginpw === one.password){
                    console.log('existing user');
                }else{
                    console.log('not existing user');
                }

            })
            console.log(usernames)

            // memberdata.crewMembers.map(onemember(()=>{
            //     console.log(loginpw)
            // }))
            // memberdata = JSON.parse(memberdata), 
            // console.log(memberdata)
             // password = data.login.password,


        } else { // error bei file lesen
            console.log('eintragung fehlgeschlagen!')
        }   
        res.status(200)
                .end(JSON.stringify({status:'success'}));     
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

  