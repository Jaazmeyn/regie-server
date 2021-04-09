const fs = require('fs');//um auf datein zugreifen
const express = require('express');
const session = require('express-session')

const app = express();

// cookie secure: true muss über https
app.set('trust proxy', 1) // trust first proxy

const nodemon = require('nodemon');


const registerRoutes = require('./routes/registerbck.js');
const loginRoutes = require('./routes/loginbck.js');

const homeRoutes = require('./routes/homebck.js') //projektsettings regie
const dashboardRoute = require('./routes/dashboardbck.js') //regie und permissed user posten etwas
const userlistRoutes = require('./routes/userlistback.js');
const projectRoute = require('./routes/projectsbck.js');
const currentprojectRoute = require('./routes/currentprojectsbck.js');


// HEROKU SERVER: ENV nummer:
const {
    PORT = process.env.PORT || 5555,
    SESS_NAME = 'sid', //seccionid
    SESS_SECRET = 'keyboard cat',
    SESS_LIFETIME = 1000 * 60 * 60 * 2, //2h
} = process.env

const server = app.listen( PORT , _=> {
    console.log( `Server läuft auf Port ${PORT}` )
})
app.use( function(req,res,next) {
    res.set({
        'Access-Control-Allow-Origin':'*', //give acess to any client
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT', 
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    })
    next();//damit andere routings weitermachen
})

const morgan = require( 'morgan' ); //protkollieren login user connected serverprotokoll (npm install morgan)
const { strict } = require('assert');
app.use( morgan( ':url :method :status :remote-addr' ) ); //basis configurationen


//default abfangen .. muss in den anderen ordner kommen
// app.use( express.static('templates'));

app.use( express.static('static'));
app.use( express.static('templates'));
app.use( express.static('regie'));

//app.use("/", express.static(__dirname + "./routes/templates"));
// //app.use("/", express.static(__dirname + "/static"));


app.use(session({
    name: SESS_NAME,
    secret: SESS_SECRET, //protect cookie of
    resave: false, //weil seccion ohnehin die gleiche bleibt
    saveUninitialized: false, //nicht notwendig -> leere seccions zu speichern für authentication

    cookie:{
        maxAge:SESS_LIFETIME,
        //path / current domain? übergeben eig.
        sameSite:strict, //true only accept cookie if its coming from same domain
        secure: true //wenn in produktion true sonst falsch
    }
})) //wenn seccion da alles normal ausführen weiterletiten z dashboard(im dashboard mit if elseseccionabgleichen ) 



// NOT LOGGED IN -  wenn ich noch keine request session userId habe weiterleiten
// also seccion objekt ist nicht initialiesiert
//im Dashboard redirect to login everywhere else
//wie lade ich eine funktion vom server in die im server importierte datei?
//const redirectLogin = require('../server')

const redirectLogin = (req,res,next)=>{
    if(!req.session.userId){
        res.redirect('/login')
    } else {
        next()
    }
}

app.use('/register', registerRoutes);// write with regie
app.use('/login', loginRoutes);// write with regie


// LOGGED IN - login redirect regie || dashboard
// module.exports = { //in der loginpage wenn angemeldet
const redirectHome = (req,res,next)=>{
    if(req.session.userId){
        //if(userId == 'regisseuraccount'){
            res.redirect('/regie')
     
           
    } else {
        next()
    }
}
// }



app.use('/dashboard', dashboardRoute);
app.use('/regie', userlistRoutes);//edit users, confirm users
app.use('/home', homeRoutes);//edit users, confirm users
app.use('/regie', projectRoute);//fully acess for loged in regie users
app.use('/regie', currentprojectRoute);
app.post('/logout', redirectLogin)

/**
 * im Maintainerberreich nach login möglichkeit user löschen & editieren
 * 
 * bewerber löschen: app.delete('/bewerber/:id) || member
 * bewerber editieren app.put('/bewerber)   || member
 * bewerber als member zulassen: app.put( '') //url ändern..
 * 
 */

  