const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können
const $ = jQuery = require('jquery');

const CrewFile = __dirname + '/../model/data/crew.json';


//wenn eingabe im browser auf login
router.get('/', (req, res) => {
    //res.redirect('login.html');
    res.sendFile(__dirname + '/templates/login.html')
})
//login
router.post('/', (req, res) => {//vom frontend to server gesendet
    let login = {
        email: req.body.email,
        password: req.body.password,
    }
    console.log('postrequest kommt an',login);
    //speicher registrierten in JSON file
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data); /* all users */ 
           // console.log(data)
            let checklogin = false;
            // existing user returnt true oder false
            data.crewMembers.forEach(e => { //aus file einzelne mail
               // console.log(e.email, e.status, 'im map einzelner loginversuch')
                let vorhanden = e.email == login.email && e.password == login.password;
                console.log(vorhanden, e, e.email, login.email, e.password, login.password)
                if(vorhanden){ //user gibts!
                    //wird hier noch dieser user abgeprüft?
                   // console.log('vorhandener user, status=',e.status)
                    if(e.status == true){
                        checklogin = true;
                        //seccoin setzen(userid)
                        console.log('login true')
                        //spei  token////id seccion 
                        let loginId = e.id;
                        console.log(loginId)
                        //id: individuelles dashboard weiterleiten
                        //router.use('/' + loginId, individual)
                    } else if(e.status == false){
                        //login = false;
                        console.log('nicht freigeschalten')
                    } //end if vorhanden
                //user kommt nicht vor
                } else { 
                    //login = false;
                    console.log('kommt nicht vor')
                }
            })  
            res.status(200)
                .end( JSON.stringify({login: checklogin}));

        }//ende readfile(!err)
        else { // readfile(err)
           // console.log('user durchsuchen fehlgeschlagen!')
            res.status(200)
                .end("readfile error");
        }
    }) //ende readfile
})//end post crew login

module.exports = router;