//nur zum umleiten

//wenn nicht angemeldet und noch kein seccion gesetzt
const redirectLogin = (req,res,next) => {
    //no seccion set yet
    if(!req.session.userId){
        res.redirect('/login')
    } else {
        next()
    }
}

// 1. angemeldet 
const redirectHome = (req,res,next)=>{
    if(req.session.userId){

        //wenn user admin ist alle berechtigungen
        //if(userId.includes(admin)){//wird im frontend
            //res.redirect('/regie') //mit einschränkung siehe JSON
        //} else if (angemeldet als member){ //  
        // else{ //user read only
                //res.redirect('/regie') //etwas mitsenden um zu sagen er ist admin??
                //if(){
                    // current project herausfinden:
                //}
        //}
    } else {
        next()
    }
}

/////REGIE acess 
// 1 user?
// regie?
// userprojects userId
// 


module.exports = {
    redirectLogin:redirectLogin, 
    redirectHome:redirectHome,
}
