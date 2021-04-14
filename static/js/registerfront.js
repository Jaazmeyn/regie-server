// $('#options').on('click', function(e){
//     e.preventDefault();
//     $('#modal').modal('toggle')
// })//end registersettings
// disabling form submissions if there are invalid fields

'use strict'

// all the forms for validation styles
var forms = $('.needs-validation')
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
           
            console.log('registerclick');
            
            // let Api = $.getJSON("http://jsonip.appspot.com?callback=?" = () => data.ip);
            let newTeamMember = {
                vorname:$('.cmVName').val(), 
                nachname:$('.cmNName').val(), 
                email:$('.cmMail').val(),
                password:$('.cmPassword').val(),
                number:$('.cmNumber').val(),
                id: Math.random().toString(),
                projectsId:[],
                // ROLE: role,
                login: false,
            }
            $.ajax({ //schicke ausgelesene daten an Server
                url: '/register',
                method: 'post', 
                data: JSON.stringify(newTeamMember),//sende neuen registrierten um in json zu speichern
                contentType:'application/json',
                success:( res ) => { //wenn erfolgreich bekomme alle members
                    //registrierung(req, allTeammembers, newTeamMember)
                    console.log(res, 'reponse')
                    $('.cmVName').val(' '), 
                    $('.cmNName').val(' '), 
                    $('.cmMail').val(' '),
                    $('.cmPassword').val(' '),
                    $('.cmNumber').val(' '),
                    $('#registerbtn').prop('disabled', false)
                        .css({"background-color":"green"})
                    $(' .row').html('<div>').addClass('meldung').html('erfolgreich registriert')
                    $('<a>').addClass('btn btn-primary loginbtn').attr({'href':'login.html'}).html('login').appendTo('.meldung')
                        
                    
                    //ZU USERINTERFACE!! im /regie $(crewmembers..tbody each bekommt td und daneben button)
                    // registrierte user zu regie userinterface

                    //$('form > input').val(' ');
                    // $('form >  .was-validated')
                    
                    // .removeClass('.is-invalid, .form-control:invalid')
                    // .addClass('.is-valid, .form-control:valid')
        
        
        
        
                },
                error:() => {
                    console.log('XHR ERROR')
                }
            })//end AJAX
        })//end register
    }, false)//gegen bubbling

 
});




