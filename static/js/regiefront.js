$('#createNewProj').on('click', function(e){
    $('#newProjModal').modal('show');


let saveProjCount = 0;
//save Projects in JSON send to bck
$('#saveNewProject').on('click', function(e){
    e.preventDefault();
    //alert('works')
    saveProjCount++;
    console.log('newProject')
    let newProject = {
        newProjectTitle: $('#newProjectTitle').val(),
        newProjSyn: $('#newProjSynopsis').val(),
        // current: true
    }
    $('#newProjModal').modal('hide');

    console.log(newProject)
    $.ajax({ // projekt daten in den user unter projekte speichern
        url: '/regie/newproject',
        method: 'post',
        data: JSON.stringify(newProject), //<- vom server in json gespeichert
        contentType:'application/json',
        success:( res ) => {
            if(saveProjCount != 1){
                alert('neues projekt wird auf aktiv gesetzt, du kannst das jederzeit in den Projektsettings ändern!'+ saveProjCount)
            } else{
                console.log('first click and proj')
            }
                // modal schließen
                console.log('projekt wurde in die datenbank gefügt')
            // projekt ins html fügen unter textarea
                //.append to newProjectdiv untereinander -> editable
                // (to profile myour projects .allproj ul li vom jsonfile)
                // function edit -> modal wieder öffnen -> ajax put
                // function delete -> ajax del
            // felder leeren

            let title = $('#newProjectTitle').val('');
            let synopsis = $('#newProjSynopsis').val('');
            $('#current-projectTitle').html('FilmProject 1:' +newProject.newProjectTitle);
            $('#synopsiss').html('synopsis:' + newProject.newProjSyn);
            $('#createNewProj').html('add members<br> & <br> scenes').css({'background-color':'green'});
            $('#projsettings').html('choose members')
            // let table = $('#crewmemberlist');
          
            // table.forEach(one=>{
            //     $('<option>').html(one.html())
            // })
        //    for (let i=0; i < table.rows.length; i++){
        //         crewmemname = table.rows[i].cells[0]; //first column
        //         $('<option>').val(i).html(crewmemname[i])
        //    }
            $('#settingsinput').append(`
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Options</label>
                        </div>
                        <select class="custom-select" id="inputGroupSelect01 optionofmembers">

                        </select>
                </div>`
          );
          $('#crewmemberlist tr').each( function(){
            let option = $(' td:eq(2)',this).html()
                // let option = one.html();
                $('<option>').val(option).appendTo('#optionofmembers');
                console.log( option, 'one', 'tableeee')
            });
        
        },
        error:() => {
            console.log('XHR ERROR')
        }
    })//end ajax
  })//ende save proj onclick
})//ende createnewproj onclick

// let contacts = {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]}
// console.log(contacts)

let allTeammembers;

//JSON CREWFILE Push crewmembers in tr for each 
$.ajax({ // projekt daten in den user unter projekte speichern
    url: 'regie/crewmemberlist',
    method: 'get',
    success:function(data){
            //let allTeammembers =  {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]};
            allTeammembers = data;
            let $tbBody = $('#memberoverview');
            allTeammembers.crewMembers.forEach(einzelner => {
                let $tr =  $('<tr>').appendTo($tbBody);
         
                //console.log(einzelner, 'einzelner');
                    $('<td>').html('1').appendTo($tr)
                    $('<td>').html(einzelner.vorname).appendTo($tr)
                    $('<td>').html(einzelner.nachname).appendTo($tr)
                    $('<td>').html(einzelner.email).appendTo($tr)
                    $('<td>').html(einzelner.number).appendTo($tr)
                    $('<td>').html(einzelner.id).appendTo($tr)
                   

                    $('<td>').append('<button>').attr({"class":"btn btn-primary editUser"}).html('edit').appendTo($tr);
                    $('<td>').append('<button>').attr({"class":"btn btn-danger delUser"}).html('delete').appendTo($tr);

                    console.log(einzelner.status)
                    let invited = einzelner.status == 'invited';
                    let angefragt = einzelner.status == 'angefragt';
                    if( invited ){
                        return $('<td>').append('<button>').attr({"class":"btn btn-success userbestatigung"}).html('invited').appendTo($tr);
                    }
                    if( angefragt ){
                        return $('<td>').append('<button>').attr({"class":"btn btn-warning karteiaufnahme"}).html('karteiaufnahme').appendTo($tr);
                    }
                    console.log($('.karteiaufnahme'))
                    $('.karteiaufnahme').on('click', function(e){
                        e.preventDefault();
                        console.log('make status = true')
                        einzelner.status == true;
                        $(this).parent().hide()
                    })

                    
                    $('.editUser').on('click', function(){
                        let $clicked = $(this).parent()
                        $clicked.css({'background-color':'yellow'})
                        //INHALT
                        let editUserId = $(this).parent().children().next().next().next().next().next().html();
                        let clickedElement = $(this).parent().children().next();
                        let clickedVN = $(clickedElement).html();
                        let clickedNN = $(clickedElement).next().html();
                        let clickedemail= clickedElement.next().next().html();
                        let clickednumber= clickedElement.next().next().next().html();

                        console.log('nname='+ clickedNN, clickedVN,'mail='+ clickedemail,'number='+  clickednumber)

                        // modal 
                        $('#AddnewUserModal').modal('show');
                        //in den feldern steht der geklickte user drinnen
                        $('h3').html('Update Crewmember')
                        //INHALT des geklicken users in modal fügen
                        let vn = $(' #CrewmemberfirstnameInput').val(clickedVN)
                        let nn =  $(' #CrewmemberlastnameInput').val(clickedNN)
                        $(' #CrewmemberemailInput').val(clickedemail)
                        $(' #CrewmembernumberInput').val(clickednumber)

                        //console.log('what', $(this).parent().children().next())

                        //ajax put 
                        // User editieren
                        $('#saveNewCrewMemberButton').html('save changes')
                        $('#saveNewCrewMemberButton').on('click',  function(e){
                            e.preventDefault();

                            // daten nach dem savechanges click aus modal holen
                            let Temmemberupdate = {
                                Id: editUserId,
                                newvn : $(' #CrewmemberfirstnameInput').val(),
                                newnn : $(' #CrewmemberlastnameInput').val(),
                                newmail : $(' #CrewmemberemailInput').val(),
                                newnumber : $(' #CrewmembernumberInput').val()
                            }
                         

                            // wenn verändert den wert und position und in der id mitschicken
                            if(clickedVN == Temmemberupdate.newvn && clickedNN == Temmemberupdate.newnn && clickedemail == Temmemberupdate.newmail && clickednumber == Temmemberupdate.newnumber){
                                console.log('no changes');
                                $('#AddnewUserModal').modal('hide');
                                $clicked.css({'background-color':''}).bind(this)

                            } else { 
                                $('#AddnewUserModal').modal('hide');
                                console.log('changes');
                                $clicked.css({'background-color':'green'})

                                $.ajax({ 
                                    // url: 'regie/crewmemberlist/'+ Temmemberupdate.Id,
                                    url: 'regie/crewmemberlist/:id',
                                    method: 'put',
                                    data: JSON.stringify(Temmemberupdate),
                                    contentType:'application/json',
                                    success:function(req, res){
                                        console.log(editUserId)
                                        console.log(Temmemberupdate.Id)

                                    },
                                    error:function(){
                                        console.log(editUserId, 'error')
                                    }
                                })//ende ajax
                            }//ende else -> wenn user geändert
                        })//ende save changes   
                    })//ende edituser onclick
                   
                    $('.delUser').on('click', delUser(einzelner))
                // for(let i in einzelner){
                //     $('<td>').html(einzelner[i][1]).appendTo($tr)
                // }
             })
    },
    error:function(){
        console.log('crewmemberlis XHR ERROR')
    }
})//ende ajax -> user in tabelle




$('.addUser').on('click',  function(){
    $('#AddnewUserModal').modal('show');
    $('#CrewmemberfirstnameInput').val('');
    $('h3').html('Add Crewmember');
    $('saveNewCrewMemberButton').html('save new Crewmember');

    //ajax post 
    $('#saveNewCrewMemberButton').on('click',  function(e){
        e.preventDefault();

        let newTeamMember = {
            vorname:$(' #CrewmemberfirstnameInput').val(),
            nachname:$(' #CrewmemberlastnameInput').val(),
            email:$(' #CrewmemberemailInput').val(),
            password: null,
            number:$(' #CrewmembernumberInput').val(),
            id: Math.random().toString(),
            projectsId:[],
            login: 'invited',
        };
        console.log('added TeamMember', newTeamMember.vorname, newTeamMember)
        $.ajax({
            url: 'regie/addMember',
            method: 'post',
            data:JSON.stringify(newTeamMember),
            contentType:'application/json',
            success:function(req, res){
                console.log('user wurde hinzugefügt')
            },
            error:function(){
                console.log('XHR ERROR')
            }
        });//ende ajax
     });//end save onclick
});//ende addUser onclick





function delUser(userId){
}
