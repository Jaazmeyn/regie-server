const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
const { json } = require('body-parser');
router.use( bodyParser.urlencoded({
    extended:true 
}));//um daten aus body auslesen zu können
router.use( bodyParser.json() );//um daten aus body auslesen zu können
router.use(express.json());

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
router.post('/memberofproj', (req,res) => {
    //frontend sendet vom editprojclick filmId mit
    let projectsId = req.body;
    let choosenMembers = []; //{vorname:'elga',id:3},

    fs.readFile(CrewFile, (err, data)=> {
        if(!err){
        data = JSON.parse(data);

            for(member of data.crewMembers){
                if(hasFilmId(member)){
                    // console.log(member.vorname, 'vorname')
                    // console.log(member.id, 'id')
                    let UserInfo = { //property : val
                        vorname: member.vorname, //member with this projectId
                        id: member.id, 
                    };
                    //console.log(UserInfo,choosenVN, 'Userinfo')
                    //bring in den arr
                    choosenMembers.push(UserInfo)
                }
            }
               
            function hasFilmId(member){//durch jedes memberekt/user
                //console.log(member)
                for(prop in member){ //gehe jede property durch -> wenn object
                    if(typeof(member[prop]) == "object"){ 
                        if (hasFilmId(member[prop])){
                            return true;
                        };//gehe durch dieses wieder durch und betrachte elemente als wären sie auf gelicher ebene
                    } else {//wenn keine property ein memberekt ist.. und die iteration done ->
                        if(prop == "filmid"){// user hat generell filme
                            if(member[prop] == projectsId.filmid){
                                return true;
                            } 
                        }
                    }//endelse
                }//endfor 
            }//iterate
        console.log(choosenMembers, 'z143')
        res.status(200)
            .set({'Content-Type':'application/json' })
            .send(JSON.stringify(choosenMembers))
        } else {
            res.status(404)
                .message('user auslesen fehlgeschlagen')
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
    let filmId = req.body.filmId.filmid;
    let Choosenmembers = req.body.ids; 
    console.log(Choosenmembers,'Choosenmembers')
    console.log(filmId, 'filmId')
    let deleteprojinmember = false;

    fs.readFile(CrewFile, (err, data) => {
        if(!err){
            data = JSON.parse(data);            
            console.log('readfile 2 push proj')

            //Member JSON durchschauen
            for(user of data.crewMembers){
                //console.log(user.projectsId, '=user.projectId')

                // mitgeschickter einzelner User aus choosenmembersarray im JSON enthalten?
                let userMitgeschickt = Choosenmembers.indexOf( user.id )  >= 0;
                    // console.log(user.vorname,'mitgeschickt ', userMitgeschickt, 'hasfilmid',hasFilmId(user) ? true:false)
                    if(hasFilmId(user)){ //funktioniert nicht hasFilmId ist immer false carlo hat aber projekt
                        if(!userMitgeschickt){
                            // data.projectsId.forEach(function(one, index ){
                            // data.crewmembers.splice( user.projectsId, data.crewmembers[user]);
                            // deleteprojinmember = true;
                            // hasFilmId(deleteprojinmember)//lösche filmId[filmid] filmId des users mit der property der FilmId

                        } else {
                            console.log(user.vorname,'nix tun')//funktioniert nicht
                        }
                    //console.log(user.vorname,'user wurde mitgesendet hat projekt schon')
                    } else {
                        if(userMitgeschickt){
                            console.log(user.vorname, 'push proj') //funktioniert
                            let filmobject = {
                                    "filmid":filmId,   
                                    "role":"user", 
                                    "permission":[{
                                        "newsfeed":"read", 
                                        "message":"direct", 
                                        "contacts":{"main":"read"}
                                        }], 
                                    "job":"member", 
                                    "zugriff":true
                                }
                            user.projectsId.push(filmobject)

                        } else{
                            // console.log(user.vorname,'nix tun user nicht mitgeschickt unten')//funktioniert
                        } 
                    }
            }

           
            function hasFilmId(member, deleteprojinmember){//durch jedes memberekt/user
                //console.log(member)
                for(prop in member){ //gehe jede property durch -> wenn object
                    // console.log(typeof(member[prop]), 'typeof') --> works
                    if(typeof(member[prop]) == "object"){ 
                            //console.log(hasFilmId(member[prop]) ? true:false, typeof(member[prop]) ? true:false,'hasFilmId(member[prop]')
                        if (hasFilmId(member[prop])){ 
                            // console.log(member[prop], 'member[prop]??????? = leerer array wenn kein obj')
                            return true;
                        };//gehe durch dieses wieder durch und betrachte elemente als wären sie auf gelicher ebene
                    } else {//wenn keine property ein memberekt ist.. und die iteration done ->
                        if(prop == "filmid"){// user hat generell filme
                            if(member[prop] == filmId){
                                console.log(data.crewMembers, member,'splice??????? this<ßßß')

                                if (deleteprojinmember == true){
                                    delete member;
                                    console.log('deleted')
                                }
                                return true;
                            } 
                        }
                    }//endelse
                }//endfor 
            }//iterate

            
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

module.exports = router;