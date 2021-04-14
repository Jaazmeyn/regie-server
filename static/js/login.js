sessionStorage.clear();

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
                console.log(res, 'request json') //kommt nicht in console
                res = JSON.parse( res );    
                userId =  res.userId;
                let login = res.login;
                console.log(login)
                if (login == true){   
                    //setze seccion                
                    sessionStorage.setItem('user', JSON.stringify(res));
                    top.location.href="/regie";
                } else {
                    sessionStorage.clear();
                    top.location.href="/login";
                }
        },//success
        error: function() {
            console.log('error', login)
        },//err
    })//ajax
})//onclick login

