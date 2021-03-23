const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
const { json } = require('body-parser');
router.use( bodyParser.json() );//um daten aus body auslesen zu können
//const regieprofile = require('./regie/regieprofilebck.js')

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
            .set("application/json")
            .end(JSON.stringify(newProject.Title, newProject.Synopsis))
            
        } else {
            console.log('projekt nicht gespeichert!!')
            res.status(200)
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
            //console.log(data)
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
    console.log(req.params, 'PUT request kommt an');

    // findByIdAndUpdate
    // Neue FRONTEND DATEN

    //JSON DATEN
    const userId = req.params; //aus url id auslesen aber muss auch im frontend iwi mitgeschickt werden
    fs.readFile(CrewFile, (err, data) => { // alte user
        if(!err){
            data = JSON.parse(data)//weil ich weiterarbeiten will in js obj
            data.crewMembers.forEach(function(one, index ){
                if ( one.id == userId.id ) {
                    data.crewMembers[index].vorname = req.body.newvn;
                    data.crewMembers[index].nachname = req.body.newnn;
                    data.crewMembers[index].email = req.body.newmail;
                }
            })
            //data[userId] = req.body; //data of the user with this id
            console.log(data)
                //problem buffer..
                fs.writeFile(CrewFile, JSON.stringify(data), (err)=>{
                res.status(200)
                    .set({'Content-Type':'application/json' } )
                    .send(JSON.stringify({ msg : `users id:${userId.id} updated`}) )
                })//end writefile
        } else { // error bei file lesen
            console.log('auslesen der user fehlgeschlagen')
            res.status(200)
            .set({'Content-Type':'application/json' } )
            .send(`fehler beim updaten`)
        }

    })//end readfile
})

//DELETE Users 
router.delete('/crewmemberlist/:id' , (req, res) => { //by query not body
    console.log('DELETE request kommt an');

    const { id } = req.params; //frontendId
    //look if exists
    const deleted = crewMembers.find( user => user.id == id)
    console.log(deleted, 'deleted')
    if(deleted){
        crewMembers = crewMembers.fileter(user[id])
    } else {
        res.status(404)
        res.send(json.stringify({"message":"no"}))
    }
    //id = req.body.id;

    fs.readFile(CrewFile, (err,data) => {
        if(!err){
            data = JSON.parse(data)
            data.crewMembers.find(each => {
                let thisUser = each.crewMembers.id == id

                fs.writeFile(CrewFile, JSON.stringify(data), (err)=>{
                    delete crewMembers.thisUser;

                    console.log('deletet', crewMembers.thisUser)

                });
            }); //ende find
        } else {
            console.log('keine id gefunden')
        }
    })//end readfile
})//ende delete



module.exports = router;