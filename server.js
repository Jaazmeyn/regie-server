const fs = require('fs');//um auf datein zugreifen
const express = require('express');
const app = express();
const nodemon = require('nodemon');


const registerRoutes = require('./routes/registerbck.js');
const loginRoutes = require('./routes/loginbck.js');
// const home = require('../') //projektsettings regie
// const dashboard = require('../') //regie und permissed user posten etwas
const regieRoutes = require('./routes/regieback.js');
const projectRoues = require('./routes/projectsbck.js');

// HEROKU SERVER: ENV nummer:
const PORT = process.env.PORT || 5555;
const server = app.listen( PORT , _=> {
    console.log( `Server läuft auf Port ${PORT}` )
})
app.use( function(req,res,next) {
    res.set({
        'Access-Control-Allow-Origin':'*', //give acess to any client
        'Access-Control-Allow-Methods': 'GET, POST', 
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    })
    next();//damit andere routings weitermachen
})

const morgan = require( 'morgan' ); //protkollieren login user connected serverprotokoll (npm install morgan)
app.use( morgan( ':url :method :status :remote-addr' ) ); //basis configurationen


//default abfangen .. muss in den anderen ordner kommen
app.use( express.static('static'));

//not logged in
app.get('/home' && '/', (req, res) => {
    return res.redirect('home.html');
})

//logged in start
app.get('/dashboard', (req, res) => {
    return res.redirect('dashboard.html');
})
app.use('/login', loginRoutes);// write with regie
app.use('/register', registerRoutes);// write with regie
app.use('/regie', regieRoutes);//edit users, confirm users
// app.use('/projects', projectRoues);//fully acess for loged in regie users



const setCrewmember = function(req, res, next){
    req.user;

}



/**
 * im Maintainerberreich nach login möglichkeit user löschen & editieren
 * 
 * bewerber löschen: app.delete('/bewerber/:id) || member
 * bewerber editieren app.put('/bewerber)   || member
 * bewerber als member zulassen: app.put( '') //url ändern..
 * 
 */

  