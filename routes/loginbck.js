const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );

router.use( bodyParser.urlencoded({
    extended:true 
}));//um daten aus body auslesen zu können
router.use( bodyParser.json() );
const $ = jQuery = require('jquery');
const CrewFile = __dirname + '/../model/data/crew.json';

// wenn eingabe im browser auf login
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/login.html')
})

// login
router.post('/', (req, res) => {//vom frontend to server gesendet
    console.log(res.body, req.body)
    //console.log(JSON.parse(req))
    let login = {
        email: req.body.email,
        password: req.body.password,
    }
    let uservorhanden = false;
    console.log('postrequest kommt an',login);
    //speicher registrierten in JSON file
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data); /* all users */ 
           // console.log(data)
            let loginuserstatus = false;
            let candidate;
            // existing user returnt true oder false
            for(let e of data.crewMembers){
            // data.crewMembers.forEach(e => { //aus file einzelne mail
               // console.log(e.email, e.status, 'im map einzelner loginversuch')
                let vorhanden = e.email == login.email && e.password == login.password; //hash password                
                if(vorhanden){ //wird bei jedem einzelnen user gecheckt -> true/false
                 uservorhanden = true;
                    candidate = e;//vorhandenen user abspeichern
                    console.log('user mit login true=',e)
                    break;//aufhören zu loopen -> nimmt dann nicht immer den letzten sondern der true ist
                }
            }  //ende forloop

            if(uservorhanden){ //wurde variable gesetzt ist user gefunden und in candidate von einzelnen usern d JSON abgespeichert
                    //loginberechtigt->
                    console.log('candidate.status=', candidate.status)
                    if(candidate.status){ //candidate ist einzelner der existiert
                        loginuserstatus = true;
                        console.log(candidate.id, 'login')
                        //id: individuelles dashboard weiterleiten

                        //ist er admin?
                        let admin = candidate.projectsId.filter(function (e) {
                            return e.role == 'user'
                        });
                        console.log(admin,'admin')
                        
                        let loginUser = {
                            login:true, 
                            userId: candidate.id, 
                            username: candidate.vorname, 
                            projects: candidate.projectsId, 
                            projektadmin: admin
                            
                        }
                        res.status(200)
                            .end( JSON.stringify(/*seccionId: uuid,*/ loginUser));
                        //get ()
                    } else {
                        //login = false;
                        console.log('nicht freigeschalten aber kommt vor')
                        loginuserstatus = false;
                        res.status(400)
                            .end( 'not allowed');
                    } //end if vorhanden
                   
            } else { 
                console.log('user nicht vorhanden')
            }
            console.log(loginuserstatus)
            

        }//ende readfile(!err)
        else { // readfile(err)
           // console.log('user durchsuchen fehlgeschlagen!')
            res.status(200)
                .end("readfile error");
        }
    }) //ende readfile
})//end post crew login

module.exports = router;