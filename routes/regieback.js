const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können

const ProjectDB = __dirname + '/../model/data/projects.json';
const CrewFile = __dirname + '/../model/data/crew.json';

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/regie.html');
})
// project {} button id saveNewProject
// $('#newProjectTitle)
// $('#newProjSynopsis)
// projekt mit id als objekt in JSON speichern, 
// projektname in userjson als neuen value projects: {1:film1, 2:film2}
router.post('/newproject', (req, res) => {
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
           fs.writeFile(ProjectDB, JSON.stringify(data), (err)=>{
               console.log('proj write',data)
           })
            res.status(200)
            .end(JSON.stringify(newProject))
            
        } else {
            console.log('projekt nicht gespeichert!!')
            res.status(200)
            .set("application/json")

                .end(JSON.stringify({status:'not success'}))
        }
    })
})
router.post('/addMember', (req, res) => {
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
    fs.readFile(CrewFile, (err,data) => {
        if(!err){
            data = JSON.parse(data),
            data.crewMembers.push(newCrewMember)
            console.log('eintragung erfolgreich!', newCrewMember.vorname)
        } else {
            console.log('eintragung fehlgeschlagen!', newCrewMember.vorname)
        }
        fs.writeFile(CrewFile, JSON.stringify(data), (err)=>{
            console.log('ueberschreiben?? sollte man nicht da pushen? aber geht eh aber ka', data)
        })
        res.status(200)
            .set({'Content-Type':'application/json' } )
            .send(JSON.stringify({ message: "success"})) //an frontend schicken
    })
})


// get Userlist 2 Push Users in table(frontend)
router.get('/crewmemberlist', (req, res) => { //vom frontend to server gesendet
    console.log('request kommt an');
    //speicher registrierten in JSON file
   
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
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

//EDIT MEMBERS
router.put('/crewmemberlist/:id', (req, res) => {
    console.log('PUT request kommt an');

    // Neue FRONTEND DATEN
    let Temmemberupdate = {
        Id: req.body.Id,
        newvn : req.body.newvn,
        newnn : req.body.newnn,
        newmail : req.body.newmail,
        newnumber : req.body.newnumber
    }
    //JSON DATEN
    fs.readFile(CrewFile, (err, data) => { // alte user
        if(!err){
            data = JSON.parse(data) //data is undefined...
            let allIds = [];
            //data.crewMembers.id.push(allIds)
            console.log(allIds)
            //console.log(data, 'data', Temmemberupdate.Id)
            //let changeMemberId = Temmemberupdate.Id;
            //console.log(changeMemberId, 'changeMemberId', data);//changememberId geht

            // let membertochange = data.crewMembers.id.forEach(element => {
            //         if(this == changeMemberId){
            //             return this;
            //         }
            //     else{
            //         console.log('not found')
            //     }
            // });
           
            // finde crewMembers.id == Temmemberupdate.Id
            //console.log('crewMembers.id,Temmemberupdate.Id'+membertochange)
            // if(crewMembers.id == Temmemberupdate.Id){

            // }
            //data.crewMembers.push(Temmemberupdate, )

            fs.writeFile(CrewFile, JSON.stringify(data), (err)=>{
                console.log('ueberschreiben?? ', data)
                let oldMember = data;
                //console.log(crewMembers.id)
            })//end writefile
        } else { // error bei file lesen
            console.log('auslesen der user fehlgeschlagen')
        }
        res.status(200)
            .set({'Content-Type':'application/json' } )
            .send(JSON.stringify({ message: "success"}))
    })//end readfile
})


module.exports = router;