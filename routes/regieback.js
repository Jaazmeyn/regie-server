const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
const { json } = require('body-parser');
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

// get Userlist 2 Push Users in table(frontend)
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



//////// PROJECTS ///////////
//wenn ausgelagert in projectdatei '/' und im frontend regie/projects
// project {} button id saveNewProject
// projektname in userjson als neuen value projects: {1:film1, 2:film2}
//newPrj
router.post('/newproject', (req, res) => {
    let newProject = {
        title: req.body.title,
        syn: req.body.syn,
        id: req.body.id,
        pfad: req.body.pfad,
        current: req.body.current,
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
    }) //end readfile
});

//get all filmprojects
router.get('/projects', (req, res) => {
    fs.readFile(ProjectDB, (err, data) => {
        if(!err){
            data = JSON.parse(data);
            let allProjects = data;
            res.status(200)
                .set("application/json")
                .end(JSON.stringify(allProjects))
        } else {
            res.status(400)
                .end('auslesen fehlgeschlagen');
        }
    })//end readfile
});//end get

//UPDATE project
router.put('/projects/:id', (req, res)=>{
    const projectId = req.params; //aus url id auslesen aber muss auch im frontend iwi mitgeschickt werden
    console.log(projectId)
    fs.readFile(ProjectDB, (err, data) => { // projekte
        if(!err){
            data = JSON.parse(data)
            data.projects.forEach(function(one, index){
                if ( one.id == projectId.id ) {
                    data.projects[index].title = req.body.newtitle;
                    data.projects[index].syn = req.body.newsyn;
                    //data.projects[index].pfad = req.body.titelBild;
                }
            })//end foreach
            fs.writeFile(ProjectDB, JSON.stringify(data), (err)=>{
                console.log(`projects id:${projectId.id} updated`)
                // res.status(200)
                //     .set({'Content-Type':'application/json' } )
                //     .send(JSON.stringify({ msg : `projects id:${projectId.id} updated`}) )
            })//endwritefile
        } else{
            console.log('auslesen der projekte fehlgeschlagen')
            res.status(400)
                .set({'Content-Type':'application/json' } )
                .send('fehler beim updaten')
        }
    })//ende readfile        
})//ende put

// usern projektId hinzufügen
// Get User with this id 2 push project in user 
// (nur wenn projektid noch nicht im user vorhanden -> ist vorhanden wenn userdiv im modal
// entferne ich user muss die projektid { } wieder aus dem user entfernt werden
// oder user berreits im div (bei wiederöffnen)oder div)

router.post('/addusertoproject', (req,res)=>{
    // res.body.coosenmembers = obj aus userIdArr & FilmId
    console.log('user2proj req kommt an')
    let filmId = req.body.filmId;
    let Choosenmembers = req.body.ids; 
    console.log(Choosenmembers, filmId, 'object w arr and filmid')
    fs.readFile(CrewFile, (err, data)=>{
        if(!err){
            data = JSON.parse(data);            
            console.log('readfile and push proj')

            let memberofProj
            Choosenmembers.forEach(function(userIdfromArr){
                let includesId, addfilmIdPermission;
                // einzelne ids aus arr
                
                // finde im JSON member mit id aus array
                // loope array durch 
                data.crewMembers.forEach(function(crew, index){ //jeder crewmember 
                    // gleiche jede id mit json ab
                    if(userIdfromArr == crew.id){ 
                    // user im Json gefunden dann speichere position film jeden dieser member
                        memberofProj = data.crewMembers[index].projectsId;

                        //des members wo ids übereinstimmen projekte auslesen
                        memberofProj.forEach(function(allproj){
                            // if( ){
                                addfilmIdPermission = false;
                            // }
                            allproj.filmid;
                            console.log(allproj, includesId,'includes????')
                        })

                        //pushe nur wenn an dieser position diese filmId noch nicht vorhanden
                        //außerhalb der schleife!!
                        
                    } else {
                        console.log(' nicht übereinstimmende userids mit array (alle anderen)', userIdfromArr + '!=crew.id' + crew.id)
                    }
                })
                // console.log(includesId,'includesId')
                //memberofProj = im json array aller filmids
                //wenn filmid noch nicht im user dann pushe
                // console.log(memberofProj,'Proj in member',filmId,'filmId')
                if( memberofProj.includes(includesId)){

                    console.log('schon drinn')
                    res.status(200)
                        .send('schon drinnnen')
                } else {
                    console.log('push')
                    filmId = filmId.filmid;
                    let filmobject = {
                        "filmid":filmId,   
                        "role":"member", 
                        "permission":[{
                            "newsfeed":"read", 
                            "message":"direct", 
                            "contacts":{"main":"read"}
                            }], 
                        "job":"co-regisseur", 
                        "zugriff":true}
                  
                    // memberofProj.push(filmId,{"permission":"member"})//jedem aus div ids
                    memberofProj.push(filmobject)//jedem aus div ids

                }   
            })
            //data.crewMembers.map()
            fs.writeFile(CrewFile, (JSON.stringify(data)),(err)=>{
                if(!err){
                    res.status(200)
                        .end('updated all filmmembers')
                } else {
                    console.log('writefile fail')
                }
            }) // writefile
        } else{
            console.log('readfile fail')
        }
    })//end readfile
})

router.delete('/projects/:id', (req, res)=>{
    console.log('DELETE proj request kommt an');

    const projectId = req.params; 
    fs.readFile(ProjectDB, (err, data) => {
        if(!err){
            console.log('readfle')

            data = JSON.parse(data)
            data.projects.forEach(function(one, index ){
                if ( one.id == projectId.id ) {
                    console.log(index,'todelete')
                    
                    data.projects.splice( index, 1);
                }//end-if
            })//end foreach
            fs.writeFile(ProjectDB, JSON.stringify(data), (err)=>{
                res.status(200)
                    .send(JSON.stringify( `proj:${projectId.id} deleted`) )
                })//end writefile
        } else {
            console.log('keine id gefunden')
        }
    })//end readfile
    
})//end delete




module.exports = router;