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

router.post('/', (req, res) => {//vom frontend to server gesendet
    let loginMember = {
        email: req.body.email,
        password: req.body.password,
    }
    console.log('postrequest kommt an',loginMember);
    //speicher registrierten in JSON file
   
    fs.readFile(CrewFile, (err, data) => { //JSON lesen -> eingetragene user auslesen
        if(!err){
            data = JSON.parse(data); /* all users */ 
           // console.log(data)
            let e; //einzelner außerhalb abspeichern
            let login = false;
            //existing user returnt true oder false
            data.crewMembers.map(e => { //aus file einzelne mail
               // console.log(e.email, e.status, 'im map einzelner loginversuch')
                let vorhanden = e.email == loginMember.email && e.password == loginMember.password;
                if(vorhanden){ //user gibts!
                    //wird hier noch dieser user abgeprüft?
                   // console.log('vorhandener user, status=',e.status)
                    if(e.status == true){
                        login = true;
                        // if(e.role == admin){
                        //     //in die /regieroute
                        //console.log('status == '+ e.status +' -> in den regieberrreich')
                            //router.sendFile('/regie.html')
                        // }
                        // if(e.role == user){
                        //     //in /dashboard
                        // }
                       // res.status(200)
                       //     .end(JSON.stringify({"login":"true","t":1}))
                    }

                    //wie komme ich von "vorhanden(true/false)" auf den user?

                    //status ändern wenn mit inviteuser/register/user
                    // fs.writeFile(CrewFile, (err, data) => {
                    //     //änder status dieses users
                    //     data.crewMembers.status = true;
                    // })
                    // wenn status erfolgreich geändert schick loginerlaubniss an client
                    // if( data.crewMembers.status == true){
                    //     res.status(200)
                    //     .send(JSON.stringify({"login":"true"})) // wenn alles geklappt hat schick true an client
                    //     // client schickt user weiter
                        // let user = vorhanden.parent();
                        // console.log(user,'whos thaat????ß???.------- ---- ------ ')
                    //}
                } //end if vorhanden
                else {//user kommt nicht vor
                   // res.status(200)
                   //     .end(JSON.stringify({"login" : "false"}))
                }
               //console.log('nach abprüfen ob vorhanden und login true',e.email == loginMember.email && e.password == loginMember.password)
               //console.log(login)
            })  

            //console.log(e, login, existingUser, 'exists?????') //beides undefined
            //data = {login:existingUser}
            //data = login;
            //console.log(data)
           // console.log('user durchsuchen erfolgreich!')

                // res.status(200)
                //     .set({'Content-Type':'application/json' } )
                //     .use('dashboard.html')
                //     .sendFile('/routes/templates/dashboard.html') //send data -> return geht nd, existing user undefined?
                //     .end(JSON.stringify({"login":"true"}))
        

            res.status(200).end( JSON.stringify({login:login}));

        }//ende readfile(!err)
        else { // readfile(err)
           // console.log('user durchsuchen fehlgeschlagen!')
            res.status(200)
                .end(JSON.stringify({"login" : "false"}))
        }
       // console.log('was ist data hier',data)

       
            //.end(JSON.stringify(data));  //antwort sucess

       


    }) //ende readfile
})//end post crew login

/** LOGIN  
 * 
 * crewmember Anmeldung members auslesen
 * 
 * */
// router.get('/', (req, res) => { 
//      console.log( 'anfrage get kommt an')
     
//     //liest aus crewfile
//     fs.readFile(CrewFile, (err, data) => {  
//         res.status(200)
//         .set({'Content-Type':'application/json' } )
//         .end(JSON.parse(data));    
//     }) //end readfile
// })//end get

module.exports = router;