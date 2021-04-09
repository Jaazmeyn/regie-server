const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
const { json } = require('body-parser');
router.use( bodyParser.json() );//um daten aus body auslesen zu können



const ProjectDB = __dirname + '/../model/data/projects.json';
const CrewFile = __dirname + '/../model/data/crew.json';

//////// PROJECTS ///////////
//wenn ausgelagert in projectdatei '/' und im frontend regie/projects
// project {} button id saveNewProject
// projektname in userjson als neuen value projects: {1:film1, 2:film2}
// newPrj
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
                if(!err){
                    console.log(`project ${projectId.id} updated`)
                    // var windoeandTab = widow.open('http://localhost:5555/regie', 'pills-project') ;
                    // windoeandTab.location.reload(true);
                    res.status(200)
                        // .redirect('back') --> page reload
                        .set({'Content-Type':'application/json' } )
                        .send(JSON.stringify({ msg : `updated project:${projectId.id}`}) )
                }
                else{
                    console.log('fehler projektänderungen in json')
                }
            })//endwritefile
        } else {
            console.log('auslesen der projekte fehlgeschlagen')
            res.status(400)
                .set({'Content-Type':'application/json' } )
                .send('fehler beim updaten')
        }
    })//ende readfile        
})//ende put


// bekomme alle user eines bestimmten projekts
router.get('/memberofproj', (req,res) => {
    //frontend sendet vom editprojclick filmId mit
    let projectsId = req.body;//warum ist das emty?? !!!!!!-!!!__!_!_!__!_!
    console.log(projectsId, 'projectsId')
    //wenn geht durch projectsId ersetzen
    let notemtyArrFromfront = "Fila_car_filmo0.6956187846334407";
    let choosenMembers = [];

    fs.readFile(CrewFile, (err, data)=> {
        if(!err){
        data = JSON.parse(data);
        //finde user mit dieser filmid und pushe sie in den array zum vergleich für add/remove user 
        data.crewMembers.filter(member => { //all users
           iterateObject(member);
        });//ende find


        function iterateObject(obj){//durch jedes objekt/user
            for(prop in obj){ //gehe jede property durch

                //wenn eine property ein objekt ist
                if(typeof(obj[prop]) == "object"){ 
                    iterateObject(obj[prop]);//gehe durch dieses wieder durch und betrachte elemente als wären sie auf gelicher ebene
                } else {//wenn keine property ein objekt ist.. und die iteration done ->
                    if(prop == "filmid"){// ..wenn property filmid ist, user hat filme
                        console.log(`user hat filme`)

                        if(obj[prop] == notemtyArrFromfront){//wenn geht durch projectsId ersetzen!
                            console.log(`user hat ausgewählten film`)

                            //wie kann ich den der zutrifft ansprechen???? obj[prop].vorname geht nicht,obj[vorname], prop[vorname], prop["vorname"], let choosenVN = obj[prop] == "vorname"/false/true
                            let choosenVN = obj[prop] == "vorname";
                            // ich bin in einem layer drinnen oder? wie komm ich da wieder raus?
                            console.log(choosenVN, 'user')

                                let UserInfo = { //property : val
                                    vorname: obj[prop] = obj.prop, //member with this projectId
                                    //id: obj[projectsId].prop == "id", // dessen if == true userid ------!!!!!!!!!!!!!!!!!!!!!
                                 };
                                 console.log(UserInfo, 'Userinfo')
                                 //bring in den arr
                                 choosenMembers.push(UserInfo)
                        } else {
                            console.log(`user hat keine filme`)
                        }
                    }//end filmid
                }//endelse
            }//endfor 
        }//iterate
        console.log(choosenMembers)
        res.status(200)
            .set({'Content-Type':'application/json' })
            .send(JSON.stringify(choosenMembers))
        } else{
            console.log('user auslesen fehlgeschlagen')
        }
    })//end read
})

// wenn von den letztabgespeicherten members des projekts, old [1,2,3] new [2,3] => schicke 1 zurück frontend
// nach bearbeitung im frontend einer der member nicht mehr vorkommt 
// router.delete('/removeuserfromproject/:userId', (req,res)=>{
//     // so wie ich alle user der projektid bekommen habe,
//     // nur dass ich diese projektid rauslösche
// })

// ausgewählten usern vom frontend wird projektid abgespeichert
router.post('/addusertoproject', (req,res) => {
    // res.body.coosenmembers = obj aus userIdArr & FilmId
    console.log('user2proj req kommt an')
    let filmId = req.body.filmId;
    let Choosenmembers = req.body.ids; 
    console.log(Choosenmembers, filmId.filmid, 'object w arr and filmid')

    fs.readFile(CrewFile, (err, data)=>{
        if(!err){
            data = JSON.parse(data);            
            console.log('readfile 2 push proj')
            //console.log(filmId, data, '= crewmembers')
            let memberofProj = [];

            data.crewMembers.forEach(function(crew){
               //console.log(crew.id )
                // User id im Choosemebers?
                console.log(`mitgeschickt? ${Choosenmembers.indexOf( crew.id )  > 0}`,crew.id)
                //console.log(crew.id[Choosenmembers.indexOf( crew.id )  > 0])
                //console.log(crew.id,'every id')

                //mitgeschickte crewids?
                 if(Choosenmembers.indexOf( crew.id )  >= 0){ 
                    //console.log(crew.id, 'nur mitgeschickte id') -> funktioniert
                    
                    
                    // 3. filmids in projekten vorhanden?
                    crew.projectsId.forEach(function(each){
                        console.log(each.filmid, 'schleife richtig?')
                        if(!filmId){
                            // wenn nein hintzufügen +
                            console.log('filmid ist im crewfile noch nicht vorhanden push')

                            filmId = filmId.filmid;
                            let filmobject = {
                                "filmid":filmId,   
                                "role":"user", 
                                "permission":[{
                                    "newsfeed":"read", 
                                    "message":"direct", 
                                    "contacts":{"main":"read"}
                                    }], 
                                "job":"member", 
                                "zugriff":true}
                          
                            // memberofProj.push(filmId,{"permission":"member"})//jedem aus div ids
                            memberofProj.push(filmobject)//jedem aus div ids
                        } else {
                            console.log('filmid berreits vorhanden')
                        }
                    })//ende forEach
                 } else { // wenn user nicht im JSON vorhanden
                    crew.projectsId.forEach(function(who){
                        //schauen ob er filmid hat
                        if(filmId){
                            // wenn ja entfernen -
                            data.projects.forEach(function(one, index ){
                                if ( one.id == projectId.id ) {
                                    console.log(index,'todelete')
                                    
                                    data.projects.splice( index, 1);
                                }//end-if
                            })//end foreach
                            //wie spreche ich dies an?
                            //who ist 1film
                            console.log(who, 'filmid vorhanden aber nicht mehr mitgeschickt -> delete filmId in person')

                        } else {
                            console.log('filmid berreits vorhanden nichts tun')
                        }
                    })//endeach
                }//endelse
            })

            fs.writeFile(CrewFile, (JSON.stringify(data)),(err)=>{
                if(!err){
                    res.status(200)
                        .end('updated all filmmembers')
                } else {
                    console.log('writefile fail')
                }
            }) // writefile
        } else { 
            console.log('readfile fail')
        }
    })//end readfile
})




// PROJECTS
router.delete('/projects/:id', (req, res)=>{
    console.log('DELETE proj request kommt an');

    const projectId = req.params; 
    fs.readFile(ProjectDB, (err, data) => {
        if (!err){
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


// // lösche alle user dieses Projekts(wenn projekt gelöscht wird)
// let todeleteusersofspecificProj;
// router.delete('/delprojusers/:id',(req, res) => {
//     const todeletId = req.query;
//     fs.readFile(crewMembers, (err, data)=>{
//         if(!err){
//         // alle members nach der zu löschenden projektId durchsuchen
//         data = JSON.parse(data);
//         todeleteusersofspecificProj = data.crewMembers.forEach(each).find( _=> {
//             each.projectId == todeletId;
//             // console.log(crewMembers)
//             //  if(each == projectId){

//             //     console.log(each, id,'wenn die id die übergeben wurde mit einer im array übereinstimmt lösche')
//             //     let gefunden = indexOf(each);
//             //     choosenmembers.splice(gefunden);
//             // }
//         })
//     } else {
//         console.log('lesefehler')
//     }
//         console.log(todeleteusersofspecificProj,'todelete')
//     })//ende fs  
// })
// //console.log(todelete,'todelete projektinstanz(gesammtes Ojekt im projectId des Users, der Projekt beinhaltet)')


module.exports = router;