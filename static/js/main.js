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
REGISTRIERUNG & anmeldung
**/
        
        const registrierung = (allTeammembers, newTeamMember) => {
            console.log('user wurde hinzugefügt')
            // if(res.status == 200){
                $( '.loginform').show();
                $( '#crewregistration').hide();
                $( '#username').html(`Hello ${$('.cmVName').val()}  <br>please Login here <br>`);
            console.log((allTeammembers.crewMembers[0]), 'weiter in den loginberreich');
            console.log(newTeamMember, 'new teammember');
        };
        const login = () => {
            $('#loginbtn').on('click', function(e){
                e.preventDefault(); 
                console.log('loginclick')
                let logindata = {
                    vorname:$('.loginname').val(),
                    password:$('.loginPasswort').val(),
                }
            })
        }
        const UserTable = (allTeammembers, newTeamMember) => {
            console.log('usertable')
        };

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
                url: '/crew/register',
                method: 'post', 
                data: JSON.stringify(newTeamMember),//sende neuen registrierten um in json zu speichern
                contentType:'application/json',
                success:( req ) => { //wenn erfolgreich bekomme alle members
                    let allTeammembers = req;
                    // newTeamMember.map(e => {})
                    let meee = allTeammembers;
                    registrierung(req, allTeammembers, newTeamMember)
                    login(meee, allTeammembers, newTeamMember);
                    UserTable(allTeammembers, newTeamMember);

                    //ZU USERINTERFACE!! im /regie $(crewmembers..tbody each bekommt td und daneben button)
                    // registrierte user zu regie userinterface
                    let html;
                    const prot = req.crewMembers.map( (einzelner) => {
                        return html = `<th>${einzelner}</th>`})
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
                email:$('.loginname').val(),
                password:$('.loginPasswort').val(),
            }

             $.ajax({ //bekomme userdater vom Server
                url: '/crew/login',
                method: 'post',
                data:JSON.stringify(login),
                contentType:'application/json',
                success:function( res ){
                    // console.log('checkmal ob vorhanden')
                     console.log(JSON.stringify(res), 'request json')
                    // if(res.status == 'success'){
                    //     let memberdata = res;
                    //     console.log(res)
                    //     memberdata.crewMembers.map(onemember(()=>{
                    //         console.log(loginpw)
                    //     }))

                        // memberdata.crewMembers.forEach(one => {
                        //     // console.log(one.vorname, 'all names')
                        //     if(loginname === one.vorname && loginpw === one.password){
                        //         console.log('existing user');
                        //     } else {
                        //         console.log('not existing user');
                        //     }
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

    }, false)//gegen bubbling

});