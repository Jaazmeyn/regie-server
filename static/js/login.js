
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
        success:function( res ){ //ist user admin?
            // console.log('checkmal ob vorhanden')
                console.log(res, 'request json')
                res = JSON.parse( res );
            //  if(res.status == 'success'){
                //res.redirect('../dashboard.html');
                //console.log('success', res.body)
                let login = res.login;
                console.log(login)
                if (login == true){
                    //weiterleiten zu dashboard?
                    top.location.href="/dashboard";
                } else {
                    console.log('not existing user')
                    top.location.href="/register";
                    
                }
        },//success
        error: function() {
            console.log('error', login)
        },//err
    })//ajax
})//onclick login

