const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen
const bodyParser = require( 'body-parser' );
router.use( bodyParser.json() );//um daten aus body auslesen zu können
//const fillSitewithIndividualUserdata = require(__dirname + '/../individualdash')

//wie lade ich eine funktion vom server in die im server importierte datei?
//const redirectLogin = require('../server')
const {redirectLogin} = require('./auth');
const {auth} = require('./auth');
const { send } = require('process');
const ProjectDB = __dirname + '/../model/data/projects.json';
const CrewFile = __dirname + '/../model/data/crew.json';


//first check if authenticated redirectLogin
router.get('/', redirectLogin, (req, res) => {
    //res.redirect('login.html');
    res.sendFile(__dirname + '/templates/dashboard.html')
})
router.get('/getUserInfo', (res, req ) => {
 console.log('session: ',req.session.userId)
})

//im dashboard/ im regie
router.get('/currentuser', (res, req ) => {
    let userId = req.body;
    let userInfos = {
        //infos aus crefile of user with this Id
        vorname:vorname ,
        nachname:nachname ,
        email:email ,
        password: password,
        number: number,
        id: id,
        status: status,
        login:login,
        projects: {
            projectsId:projectsId,// alle projectIds und permissions
            //infos aus FiilmDB
            filmprojtitle: filmprojtitle,
            filmprojsyn: filmprojsyn,
            current: current,
        }, 
    }

    //get infos of user with this Id
    fs.readFile(CrewFile, (data, err) => {
        if(!err){
            data = JSON.parse(data);
        
            // finde user (regie/member)
            //und speichere userdaten ab um an fontend zu schickens

        data.crewMembers.find((userId,index) => {
            vorname = userId.vorname[index];
            nachname = userId.nachname[index];
            email = req.body.email; 
            password = req.body.password;
            number = req.body.number;
            id = req.body.id;
            projectsId = req.body.projectsId; // das ist das projekt mit allen permissen für user
            status = req.body.login
        });
        } else {
            console.log('readfile one user')
        }

    })
    // finde all projects -> find current -> send to front current true
    fs.readFile(ProjectDB, (data, err) => {
        if(!err){
            data = JSON.parse(data);
            data.find((projectsId, index) => { //projectsid vom user ausgelesen [] array
                filmprojtitle = projects[projectsId].title;
                filmprojsyn = projects[projectsId].syn;
                current = projects[projectsId].current;
            })
        } else {
            console.log('auslesen des einen projekts für user fehlgeschlagen')
        }
    })
    // poste current project of this user in 
    res.status(200)
        .set({'Content-Type':'application/json' })
        .send(JSON.stringify(userInfos))
})


//router.use('/:id', fillSitewithIndividualUserdata)

module.exports = router;