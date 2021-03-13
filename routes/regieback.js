const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können

const ProjectDB = __dirname + '/../model/data/projects.json';
const CrewFile = __dirname + '/../model/data/crew.json';

router.get('/', (req, res) => {
    res.sendFile('regie.html');
})
// project {} button id saveNewProject
// $('#newProjectTitle)
// $('#newProjSynopsis)
// projekt mit id als objekt in JSON speichern, 
// projektname in userjson als neuen value projects: {1:film1, 2:film2}
router.post('/newProject', (req, res) => {
    let newProject = {
        Title: req.body.newProjectTitle,
        Synopsis: req.body.newProjSyn,
    }
    
    fs.readFile(ProjectDB, (err, data) => {
        if(!err){
            data = JSON.parse(data),
            data.projects.push(newProject);
            console.log('erfolgreich erstellt')

           //!!!-- -  fs.writeFile()
            res.status(200)
            .end(JSON.stringify(newProject))
            
        } else {
            console.log('projekt nicht gespeichert!!')
            res.status(200)
                .end(JSON.stringify({status:'not success'}))
        }
    })
})

// get Userlist 2 Push Users in table(frontend)
router.get('/crewmemberlist', (req, res) => { //vom frontend to server gesendet
    console.log('request kommt an',res);
    //speicher registrierten in JSON file
   
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        console.log(data, 'data')
        if(!err){
            data = JSON.parse(data);
            console.log(data)
        } else { // error bei file lesen
            console.log('auslesen der user fehlgeschlagen')
        }
        res.status(200)
            .set({'Content-Type':'application/json' } )
            .end(JSON.stringify(data),  //antwort sucess
        ) //ende readfile
    }) 
})//end crewmemberpaste
module.exports = router;