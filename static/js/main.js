// disabling form submissions if there are invalid fields

'use strict'
// all the forms for validation styles
var forms = $('.needs-validation')
$( '.loginform').hide();
// Loop over them and prevent submission (Bootstrap basic validation)
Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { //wenn invalide
            e.preventDefault()
            e.stopPropagation()
        }
        form.classList.add('was-validated');            
        $( '#submit button' ).prop( 'disabled', true );
        
/*
REGISTRIERUNG
**/
        $('#registerbtn').on('click', function(e){
            e.preventDefault();
            console.log('registerclick')

            // let Api = $.getJSON("http://jsonip.appspot.com?callback=?" = () => data.ip);
            let newTeamMember = {
                vorname:$('.cmVName').val(), 
                nachname:$('.cmNName').val(), 
                email:$('.cmMail').val(),
                password:$('.cmPassword').val(),
                number:$('.cmNumber').val(),
                id: Math.random().toString(),
                login: false,
            }
            $.ajax({ //schicke ausgelesene daten an Server
                url: '/crew',
                method: 'post', 
                data: JSON.stringify(newTeamMember),
                contentType:'application/json',
                success:( req, res ) => {
                    console.log('user wurde hinzugefügt')
                    // if(res.status == 200){
                        $( '.loginform').show();
                        $( '#crewregistration').hide();
                        $( '#username').html(`Hello ${$('.cmVName').val()}  <br>please Login here <br>`);
                        console.log(req, 'in den loginberreich');
                        // registrierte user zu regie userinterface
                        let html;
                        const prot = res.forEach( einzelner => html = `<th>${einzelner}</th>`)
                        $('<tr>').html(prot).appendTo('html')
                    // } else {
                    //     console.log(' js-success', res, newTeamMember)
                    // }
                },
                error:() => {
                    console.log('XHR ERROR')
                }
            })//end AJAX
        })//end register
  

        /**
         * LOGIN
         */
        $('#loginbtn').on('click', function(e){
            e.preventDefault(); 
            console.log('loginclick')
            let login = {
                vorname:$('.loginname').val(),
                password:$('.loginPasswort').val(),
            }
            $.ajax({ //schicke ausgelesene daten an Server
                url: '/crew',
                method: 'get',
                data: JSON.stringify(login),
                contentType:'application/json',
                success:( res ) => {
                    console.log('checkmal ob vorhanden')
                    if(res.status == 'success'){
                        
                        console.log(login.vorname ,'logged in')
                    //     req.indexOf( newTeamMember )
                        //weiterleitung in newsberreich
                    }
                },
                error:() => {console.log('error')}
            })//ajax
        })//onclick login

    }, false)//gegen bubbling
})