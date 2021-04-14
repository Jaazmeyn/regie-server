const fs = require('fs');//um auf datein zugreifen
const express = require('express');
const app = express();

const registerRoutes = require('./routes/registerbck.js');
const loginRoutes = require('./routes/loginbck.js');
const homeRoutes = require('./routes/homebck.js') //projektsettings regie
const userlistRoutes = require('./routes/userlistback.js');
const projectRoute = require('./routes/projectsbck.js');


// HEROKU SERVER: ENV nummer:
PORT = process.env.PORT || 5555;

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
app.use( morgan( ':url :method :status :remote-addr' ) ); //basis configurationen


//default abfangen
app.use( express.static('static'));
app.use( express.static('templates'));
app.use( express.static('regie'));

app.use('/register', registerRoutes);// write with regie
app.use('/login', loginRoutes);// write with regie
app.use('/regie', userlistRoutes);//edit users, confirm users
app.use('/home', homeRoutes);//edit users, confirm users
app.use('/regie', projectRoute);//fully acess for loged in regie users



app.get('/home.html', (req,res) => {
    res.redirect('/home')
})
app.get('/login.html', (req,res)=>{
    res.redirect('/login')
})
app.get('/register.html', (req,res)=>{
    res.redirect('/register')
})

  