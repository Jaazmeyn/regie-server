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
        // const registrierung = (allTeammembers, newTeamMember) => {
        //     console.log('user wurde hinzugefügt')
        //     // if(res.status == 200){
        //     $( '#username').html(`Hello ${$('.cmVName').val()}  <br>please Login here <br>`);
        //     console.log((allTeammembers.crewMembers[0]), 'weiter in den loginberreich');
            
        //     console.log(newTeamMember, 'new teammember');
        // };


        $('#registerbtn').on('click', function(e){
            e.preventDefault();
//             <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
//                  Launch demo modal
//              </button>
           
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
                success:( req, res ) => { //wenn erfolgreich bekomme alle members
                    let allTeammembers = req; 
                    console.log(req, 'registersuccess')
                    registrierung(req, allTeammembers, newTeamMember)
                    console.log(res, 'reponse')
                    //ZU USERINTERFACE!! im /regie $(crewmembers..tbody each bekommt td und daneben button)
                    // registrierte user zu regie userinterface
                },
                error:() => {
                    console.log('XHR ERROR')
                }
            })//end AJAX
        })//end register
    }, false)//gegen bubbling

 
});




