/**
 * LOGIN
 */
sessionStorage.clear();
$('#loginbtn').on('click', function(e){
    e.preventDefault(); 
    console.log('loginclick')

    let login = {
        email:$('.loginname').val(), 
        password:$('.loginPasswort').val(),
    }
    //console.log(login)
    $.ajax({ //schicke userdater vom Server 
        url: '/login',
        method: 'post',
        data:JSON.stringify(login), //schick eingegebene daten an server
        contentType:'application/json',
        success:function( res ){ //ist user admin?
                console.log(res, 'request json') //kommt nicht in console
                res = JSON.parse( res );    
                userId =  res.userId;
                let login = res.login;
                console.log(login)
                if (login == true){                    
                    sessionStorage.setItem('user', JSON.stringify(res));
                    top.location.href="/regie";

                    //top.location.href='/dashboard/:id';
                } else if (login == 'invited'){
                    $('<div>').addClass('meldung').html('wenn Sie schon registriert sind, haben sie Zugang, sobald ihr berreich für ein projekt freigeschalten wurde. Die Info erhalten sie frühestmöglich per email').appendTo('#logininfo')
                    console.log('not accepted to projectyet')
                } else {
                    $('<div>').addClass('meldung').html('not existing user').appendTo('#logininfo')
                    console.log('regisseur')
                }
        },//success
        error: function() {
            console.log('error', login)
        },//err
    })//ajax
})//onclick login

