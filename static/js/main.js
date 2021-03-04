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
        console.log(form);
        $( '#submit button' ).prop( 'disabled', true );
        

        $('#registerbtn').on('click', function(e){
            e.preventDefault();
            let newTeamMember = {
                vorname:$('.cmVName').val(), 
                nachname:$('.cmNName').val(), 
                email:$('.cmMail').val(),
                password:$('.cmPassword').val(),
                number:$('.cmNumber').val(),
                login: false
            }
            $.ajax({ //schicke ausgelesene daten an Server
                url: '/crew',
                method: 'post',
                data: JSON.stringify(newTeamMember),
                contentType:'application/json',
                success:( res ) => {
                    if(res.status == 'success'){
                        let login = `<div class="container"><h1>Login</h1><div id="crewlogin">
                        <form class="row g-3 needs-validation" novalidate>
                            <div class="col-md-4">
                                <label for="validationCustom03" class="form-label">Password</label>
                                <input value="12345" type="password" class="form-control cmPassword" id="validationCustom03" required>
                                <div class="invalid-feedback">
                                    Please provide a valid password.
                                </div>
                            </div>
                            <div class="col-md-4">
                            <label for="validationCustom02" class="form-label ">Last name</label>
                            <input value="isa" type="text" class="form-control cmNName" id="validationCustom02" required>
                            <div class="valid-feedback">
                                Looks good!
                            </div><br>
                            <div class="col-12">
                                <button class="btn btn-primary " id="loginbtn" type="button">Login</button>
                            </div>
                        </form>
                    </div></div>`;
                    $('body').append('<div>').html(login);   
                    $('#loginbtn').on('click', function(e){
                        e.preventDefault(); 
                        console.log('loginclick')
        
                        $.ajax({ //schicke ausgelesene daten an Server
                            url: '/crew',
                            data: JSON.stringify(res),
                            method: 'get',
                            contentType:'application/json',
                            success:( req ) =>{
                                console.log(res, 'this isssssss -- response!!!!!!!!')
                                if(res.status == 'success'){
                                    console.log('!!!!success')
                                    res.indexOf( newTeamMember )
                                    //weiterleitung in newsberreich
                                }
                            }
                        })//ajax
                    })//onclick login
                    
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
