let allTeammembers, editUserId;
let jeder = []; //einzelner ist objekt in array

//// EDIT USER ////////
function Edit(){
    $('.editUser').on('click', function(){
        let $clicked = $(this).parent() //<tr>
        // $clicked.css({'background-color':'yellow'})
        let clickedElement = $(this).parent().children().next(); 
        //console.log('clicked element',clickedElement ) 

        //clicked tr auslesen 
        editUserId = $(this).parent().children().next().next().next().next().next().html();
        let clickedVN = clickedElement;
        let clickedNN = clickedElement.next();
        let clickedemail = clickedElement.next().next();
        let clickednumber= clickedElement.next().next().next();
        
        //this=button, jeder= array mit jedem user als Objekt[{user1}], 
        console.log('editUserId', editUserId, clickedNN.html(), clickedVN.html());
        // !!! ID DES EINZELNEN IM BACKEND !!!
        // let thisUserId = jeder.find(id); //userid: number 

        // MODAL EDITUSER
        // von adduser zu changeuser modal
        $('#AddnewUserModal').modal('show');
        //in den feldern steht der geklickte user drinnen
        $('h3').html('Update Crewmember')
        $('#saveNewCrewMemberButton').html('save changes')
        //INHALT des geklicken users in modal fügen
        $(' #CrewmemberfirstnameInput').val(clickedVN.html());
        $(' #CrewmemberlastnameInput').val(clickedNN.html());
        $(' #CrewmemberemailInput').val(clickedemail.html());
        $(' #CrewmembernumberInput').val(clickednumber.html());
       

            function saveEditedUser(){
                $('#saveNewCrewMemberButton').on('click',  function(e){
                    e.preventDefault();

                    //input auslesen
                    let Temmemberupdate = {
                        id:editUserId,
                        newvn : $(' #CrewmemberfirstnameInput').val(), 
                        newnn : $(' #CrewmemberlastnameInput').val(),
                        newmail : $(' #CrewmemberemailInput').val(),
                        newnumber : $(' #CrewmembernumberInput').val(),
                        login:true
                        //wenn status geändert
                    }
                    // user im modal unverändert
                    if(clickedVN.html() == Temmemberupdate.newvn && clickedNN.html() == Temmemberupdate.newnn && clickedemail.html() == Temmemberupdate.newmail && clickednumber.html() == Temmemberupdate.newnumber){
                        console.log('no changes');

                        $('#AddnewUserModal').modal('hide');
                        $clicked.css({'background-color':''})
                    } 
                    else { // user veraendert
                        console.log('changes');
                        $('#AddnewUserModal').modal('hide');

                        // tr mit neuen daten befüllen
                        clickedVN.html(Temmemberupdate.newvn)
                        clickedNN.html(Temmemberupdate.newnn)
                        clickedemail.html(Temmemberupdate.newmail)
                        clickednumber.html(Temmemberupdate.newnumber)
                        
                        //userupdate zum server, damit der im json updaten kann
                        $.ajax({ 
                            url: 'regie/crewmemberlist/' + editUserId,
                            method: 'put', 
                            data: JSON.stringify(Temmemberupdate),
                            contentType:'application/json',
                            success:function(req, res){
                                $('data-user')
                                console.log(editUserId)
                                console.log(Temmemberupdate.id)
                            },
                            error:function(){
                                console.log(editUserId, 'error')
                            }
                        })//ende ajax
                    }//ende else -> wenn user geändert
                })//ende save changes   
            }//end save user
        saveEditedUser()
    })//ende edituser onclick
}//ende Editfunction im ajax aufgerufen unter create table

function Allow(){ //button erst nach makeUsertable verfügbar-> make usertable ist im foreach drinnen
    $('.allowbtn').on('click', function(){
        let $clicked = $(this).parent();
        $clicked.css({"background-color":"lightblue"})
        jeder.status = true;
        $(this).hide();
        // html element variable $tr
        // clicked 
        let clickedTr = $clicked.children().$tr;
        console.log(jeder, clickedTr)
        $('<td>').append('<button>').attr({"class":"btn btn-primary editUser"}).html('edit').appendTo(clickedTr);
        $('<td>').append('<button>').attr({"class":"btn btn-danger delUser"}).html('delete').appendTo(clickedTr);
        Edit();
        //saveEditedUser()//hier ist login auf true wenn ändern sowieso 
    })//end onclick
}//ende allowfunction


//// DELETE USER ////////
function Del(){
    $('.delUser').on('click', function(){
        let $clicked = $(this).parent();
        //INHALT
        let id = $(this).parent().children().next().next().next().next().next().html();
        $.ajax({
            url:'regie/crewmemberlist/:id',
            method: 'delete',
            data: JSON.stringify(id),
            contentType:'application/json',
            success:function(res){
                //window.onloadstart();
                //clickedElement.remove()
                console.log('server erfolgreich')
                $clicked.remove();

            },
            error:function(){
                console.log('delete XHR ERROR')
            }
        })
    })
}//ende delfunction


//JSON CREWFILE Push crewmembers in tr for each 
$.ajax({ // projekt daten in den user unter projekte speichern
    url: 'regie/crewmemberlist',
    method: 'get',
    success:function(data){
            //let allTeammembers =  {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]};
            allTeammembers = data;
            allTeammembers.crewMembers.forEach(einzelner => {
                jeder.push(einzelner); //jeder ist global
                makeUsertable(einzelner);
             })
             //console.log(jeder, 'jeder')
             
            Edit();
            Allow();
            Del();
    },
    error:function(){
        console.log('crewmemberlist XHR ERROR')
    }
})//ende ajax -> user in tabelle

function makeUsertable(einzelner){
    let $tbBody = $('#memberoverview');
    let $tr =  $('<tr>').appendTo($tbBody);
    //
    //console.log(einzelner);<- alle eineln in object
    //console.log(jeder);<- objects im array..
        $('<td>').html('1').appendTo($tr) //mit foreach zählen countvariable?
        $('<td>').html(einzelner.vorname).appendTo($tr)
        $('<td>').html(einzelner.nachname).appendTo($tr)
        $('<td>').html(einzelner.email).appendTo($tr)
        $('<td>').html(einzelner.number).appendTo($tr)
        $('<td>').html(einzelner.id).appendTo($tr)
       
        ///// USERSTATUS für login
        //Achtung in foreach schleife!!!!!!!!! auch wenn ichs auslagere
        if(einzelner.status == true){
            $('<td>').append('<button>').attr({"class":"btn btn-primary editUser"}).html('edit').appendTo($tr);
            $('<td>').append('<button>').attr({"class":"btn btn-danger delUser"}).html('delete').appendTo($tr);
 
        } else if(einzelner.status == false){ //wenn user sich ohne invitelink registriert
            $('<td>').append('<button>').attr({"class":"btn btn-primary allowbtn"}).html('allow').appendTo($tr);
        } else {
                $('<td>').append('<button>').attr({"class":"btn btn-success userbestatigung"}).html('invited').appendTo($tr);
        }

}//ende makeUsertable function in foreach schleife!!!!!!

    ///////ADD USER //////////////////// 
$('.addUser').on('click',  function(){
    $('#AddnewUserModal').modal('show');

    // modal inputfeld leeren
    $('#CrewmemberfirstnameInput').val('');
    $('#CrewmemberlastnameInput').val('');
    $(' #CrewmemberemailInput').val('');
    $(' #CrewmembernumberInput').val('');

    $('h3').html('Add Crewmember');
    $('saveNewCrewMemberButton').html('save new Crewmember');

    //save updated
    $('#saveNewCrewMemberButton').on('click',  function(e){
        e.preventDefault();
        console.log('new member')
        $('#AddnewUserModal').modal('hide');

        let newTeamMember = {
            vorname:$(' #CrewmemberfirstnameInput').val(),
            nachname:$(' #CrewmemberlastnameInput').val(),
            email:$(' #CrewmemberemailInput').val(),
            number:$(' #CrewmembernumberInput').val(),
            password: null,
            id: Math.random().toString(),
            projectsId:[],
            login: true,
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
                console.log('adduser XHR ERROR')
            }
        });//ende ajax
     });//end save onclick
});//ende addUser onclick

function addMemberToProject(){
    $('#addToProject').on('click', function(e){ //project unique Id im User gespeichert 
        // feld für projekt eingeben
        e.preventDefault();

        // besser als input: selects mit projekten befüllen

        // <div class="form-group">
        //     <label for="project2member">Project Name</label>
        //     <select class="form-control" id="project2member">
        //         <option >browse Projects..</option>
        //         <option data-filmnumber = 'i'>2</option>
        //         <option>3</option>
        //         <option>4</option>
        //         <option>5</option>
        //     </select>
        // </div>
        let html = `
        <div class="col-md-12">
            <label for="CrewmembernumberInput" class="form-label">Project Name</label>
            <select value="first film" type="text" class="form-control cmProject" id="project2member" required>                
        </div><br><br> 
        `;
        $('<div>').html(html).addClass('projectname').appendTo('#newinput');
        //inhalt aus den selects
        $.ajax({
            url:'/regie/projects',
            method:'get',
            success:function(data){
                let projectsOfThatMember = data.crewMembers.projectsId[id];
                projects.forEach(function(each){
                    let projecttitle = each.projects.Title;
                    let projectid = each.projects.id;

                    $('<option>').html(projecttitle).attr({'cmProject': projectid }).appendTo('')
                })
            },
            error:function(){
                console.log('projects XHR error')
            }
        })

    })
}
addMemberToProject()








//////////    PROJECT     ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

let saveProjCount = 0;
let Projecttitle;

$('#createNewProj').on('click', function(e){
    $('#newProjModal').modal('show');

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
                if(saveProjCount >= 1){
                    alert('neues projekt wird auf aktiv gesetzt, du kannst das jederzeit in den Projektsettings ändern!'+ saveProjCount)
                } else{
                    JSON.parse(res)
                    console.log(res,'first click and proj')
                }
                    // modal schließen
                    console.log('projekt wurde in die datenbank gefügt')
                // projekt ins html fügen unter textarea
                    //.append to newProjectdiv untereinander -> editable
                    // (to profile myour projects .allproj ul li vom jsonfile)
                    // function edit -> modal wieder öffnen -> ajax put
                    // function delete -> ajax del
                // felder leeren

                Projecttitle = res.Title;
                console.log( Projecttitle,'projeeeeeectttttooooiiitel')
                //let title = $('#newProjectTitle').val('');
                let synopsis = $('#newProjSynopsis').val('');
                let projTitle =  $('#current-projectTitle').html('FilmProject 1:' +newProject.newProjectTitle);
                $('#synopsiss').html('synopsis:' + newProject.newProjSyn);
    
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
if(saveProjCount >= 0){
    $('#createNewProj').html('add members<br> & <br> scenes').css({'background-color':'green'});
    $('#projsettings').html('choose members')
}