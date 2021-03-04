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
        

        $('#registerbtn').on('click', function(e){
            e.preventDefault();
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
                url: '/crewregister',
                method: 'post',
                data: JSON.stringify(newTeamMember),
                contentType:'application/json',
                success:( res ) => {
                    if(res.status == 'success'){
                        $( '.loginform').show();
                        $( '#crewregistration').hide();
                        $( '#username').html(`Hello ${$('.cmVName').val()}  <br>please Login here <br>`);
                    } else {
                        console.log(' success', res, newTeamMember)
                    }
                },
                error:() => {
                    console.log('XHR ERROR')
                }
            })//end AJAX
        })//end register


    }, false)//gegen bubbling
})

$('#loginbtn').on('click', function(e){
    e.preventDefault(); 
    console.log('loginclick')
    let login = {
        password:$('.cmPassword').val(),
        vorname:$('.cmVName').val(),
    }

    $.ajax({ //schicke ausgelesene daten an Server
        url: '/crewlogin',
        method: 'post',
        data: JSON.stringify(login),
        contentType:'application/json',
        success:( req ) =>{
            console.log(req, 'this isssssss -- response!!!!!!!!')
            // if(req.status == 'success'){
            //     console.log('!!!!success')
            //     req.indexOf( newTeamMember )
            //     //weiterleitung in newsberreich
            // }
        }
    })//ajax
})//onclick login

{/* <table class="table caption-top">
            <caption>List of main crewmembers(all day)</caption>
            <thead>
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email Adress</th>
                <th scope="col">Phone number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>DOP</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>TALENT</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                <td>CUT</td>
              </tr>

            </tbody>
          </table> */}
