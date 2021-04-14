const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
const { json } = require('body-parser');
const projectRoute = require('./projectsbck')
router.use( bodyParser.json() );//um daten aus body auslesen zu können
//const regieprofile = require('./regie/regieprofilebck.js')


const ProjectDB = __dirname + '/../model/data/projects.json';
const CrewFile = __dirname + '/../model/data/crew.json';


//GET ALL USERS
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/regie.html');
})
//ADD NEW USER 
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
       //an frontend schicken
    })
    res.status(200)
    .set({'Content-Type':'application/json' })
    .send(JSON.stringify({ message: "success"}))
})

// All users for table(frontend)
router.get('/crewmemberlist', (req, res) => { //vom frontend to server gesendet
    console.log('"crewmemberlist for tr"- request kommt an');
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
        .end(JSON.stringify(data))  //antwort sucess 
    }) //ende readfile

})//end crewmemberpaste

// EDIT MEMBERS
router.put('/crewmemberlist/:id', (req, res) => {
    console.log(req.params, 'PUT request kommt an');

    //JSON DATEN
    const userId = req.params; //aus url id auslesen aber muss auch im frontend iwi mitgeschickt werden
    
    fs.readFile(CrewFile, (err, data) => { // alte user
        if(!err){
            data = JSON.parse(data)//weil ich weiterarbeiten will in js obj
            data.crewMembers.forEach(function(one, index ){ //one=einzelner, index = stelle
                if ( one.id == userId.id ) {//wenneinzelner vom json gleiche id hat wie die vom frontend geschickte id
                    console.log(data.crewMembers[index], 'changeee- - - - - - - - - -- - -- ')
                    data.crewMembers[index].vorname = req.body.newvn;
                    data.crewMembers[index].nachname = req.body.newnn;
                    data.crewMembers[index].email = req.body.newmail;
                    data.crewMembers[index].number = req.body.newnumber;
                    data.crewMembers[index].status = req.body.login;
                }
            })
            //data[userId] = req.body; //data of the user with this id
            console.log(data)
                fs.writeFile(CrewFile, JSON.stringify(data), (err)=>{
                res.status(200)
                    .set({'Content-Type':'application/json' } )
                    .send(JSON.stringify({ msg : `users id:${userId.id} updated`}) )
                })//end writefile
        } else { // error bei file lesen
            console.log('auslesen der user fehlgeschlagen')
                res.status(400)
                    .set({'Content-Type':'application/json' } )
                    .send(`fehler beim updaten`)
        }
    })//end readfile
})

//ALLOW Members
router.put('/allow/:id', (req, res)=>{
    const userId = req.params; 
    fs.readFile(CrewFile,(err, data)=>{
        if(!err){
            data = JSON.parse(data);
            data.crewMembers.forEach(function(one, index ){ 
                if ( one.id == userId.id ) {
                    data.crewMembers[index].status = req.body.login;
                }
            })
            fs.writeFile(CrewFile, JSON.stringify(data), (err) => {
                res.status(200)
                    .set({'Content-Type':'application/json' } )
                    .send(JSON.stringify({ msg : `users id:${userId.id} allowed`}) )
            })
        }else{
            console.log('user auslesen fehlgeschlagen!')
        }
    })//ende readfile
})//ende put

//DELETE Users 
router.delete('/crewmemberlist/:id' , (req, res) => { //by query not body
    console.log('DELETE request kommt an');
    const userId = req.params; //aus url id auslesen aber muss auch im frontend iwi mitgeschickt werden
    console.log(userId, 'userId')
    fs.readFile(CrewFile, (err,data) => {
        if(!err){
            data = JSON.parse(data)//weil ich weiterarbeiten will in js obj
            data.crewMembers.forEach(function(one, index ){
                if ( one.id == userId.id ) {
                    data.crewMembers.splice( index, 1);
                    console.log(index,'todelete')
                    //data.crewMembers.splice(data.crewMembers[index], index)
                }//end if
            })
            //console.log(data)
            fs.writeFile(CrewFile, JSON.stringify(data), (err)=>{
                res.status(200)
                    .send(JSON.stringify( `users id:${userId.id} deleted`) )
                })//end writefile
        } else {
            console.log('keine id gefunden')
        }
    })//end readfile
})//ende delete

module.exports = router;