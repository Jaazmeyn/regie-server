
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
                console.log(res, 'request json')
                res = JSON.parse( res );        
                let login = res.login;
                console.log(login)
                if (login == true){
                    //weiterleiten zu dashboard?
                    top.location.href="/dashboard";
                    //top.location.href='/dashboard/:id';
                } if(login == 'invited'){
                    $('<div>').addClass('meldung').html('wenn Sie schon registriert sind, haben sie Zugang, sobald ihr berreich für ein projekt freigeschalten wurde. Die Info erhalten sie frühestmöglich per email').appendTo('#logininfo')
                    console.log('not accepted to projectyet')
                }else {
                    $('<div>').addClass('meldung').html('not existing user').appendTo('#logininfo')
                    console.log('not existing user')
                }
        },//success
        error: function() {
            console.log('error', login)
        },//err
    })//ajax
})//onclick login

