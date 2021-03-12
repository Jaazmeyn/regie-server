
/**
 * LOGIN
 */
$('#loginbtn').on('click', function(e){
    e.preventDefault(); 
    console.log('loginclick')

    let login = {
        email:$('.loginname').val(),
        password:$('.loginPasswort').val(),
    }

    $.ajax({ //schicke userdater vom Server 
        url: '/login',
        method: 'post',
        data:JSON.stringify(login), //schick eingegebene daten an server
        contentType:'application/json',
        success:function( res, req ){ //req -> db ist user admin?
            // console.log('checkmal ob vorhanden')
                console.log(JSON.stringify(res), 'request json')
            //  if(res.status == 'success'){
                //res.redirect('../dashboard.html');
                console.log('success')
                
            //     let memberdata = res;
            //     console.log(res)
            //     memberdata.crewMembers.map(onemember(()=>{
            //         console.log(loginpw)
            //     }))

                // memberdata.crewMembers.forEach(one => {
                //     // console.log(one.vorname, 'all names')
                //     if(loginname === one.vorname && loginpw === one.password){
                //         console.log('existing user');
                    //  } else {
                    //      console.log('not existing user');
                    // }
                //})
                console.log(login.email ,'logged in', res)
            //     req.indexOf( newTeamMember )
                //weiterleitung in newsberreich
        },//sucess
        error: function() {
            console.log('error')
        },//err
    })//ajax
})//onclick login

