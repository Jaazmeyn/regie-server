//_______________________________________________//
/////////////////// USER TAB //////////////////////

let allTeammembers, userId, index;
let jeder = []; //einzelner ist objekt in array


//// EDIT USER ////////
function Edit(){
    $('.editUser').on('click', function(){
        let $clicked = $(this).parent() //<tr>
        // $clicked.css({'background-color':'yellow'})
        let clickedElement = $(this).parent().children().next(); 
        //console.log('clicked element',clickedElement ) 

        //clicked tr auslesen 
        userIdfeld = $(this).parent().children().next().next().next().next().next();
        userId = $(this).parent().children().next().next().next().next().next().html();
        let clickedVN = clickedElement;
        let clickedNN = clickedElement.next();
        let clickedemail = clickedElement.next().next();
        let clickednumber= clickedElement.next().next().next();
        
        //this=button, jeder= array mit jedem user als Objekt[{user1}], 
        console.log('userId', userId, clickedNN.html(), clickedVN.html());
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
       
        function addMemberToProject(){ //da kommt man über edit user hin
            $('#addToProject').on('click', function(e){ //project unique Id im User gespeichert 
                // feld für projekt eingeben
                e.preventDefault();

                let html = `
                <div class="col-md-12">
                    <label for="CrewmembernumberInput" class="form-label">Project Name</label>
                    <select value="first film" type="text" class="form-control cmProject" id="project2member" required>
                    </select>                
                </div><br><br> 
                `;
                $('<div>').html(html).addClass('projectname').appendTo('#newinput');

                //inhalt aus den selects
                let projecttitle;

                $.ajax({
                    url:'/regie/projects',
                    method:'get',
                    success:function(res){
                        res = JSON.parse(res),
                        // let projectsOfThatMember = data.crewMembers.projectsId[id];
                        res.projects.forEach(function(each){
                            projecttitle = each.title;
                            projectsId = each.id; console.log('projectid !!!- - - - - - ', projectsId)
                            console.log(projecttitle)
                            //erzeuge option befülle mit allen filmen und stoppe dann
                            $('<option>').html(projecttitle).attr({'data-cmProject': projectsId }).appendTo('#project2member')
                        })//im edituser aufgerufen
                        //console.log('projecttitle, projectsId', projecttitle, projectsId)
                    },
                    error:function(){
                        console.log('projects XHR error')
                    }
                })//ende ajax
            }) //end addtoproject
        }// ende addMemberToProject
        addMemberToProject();

        function saveEditedUser(){
            $('#saveNewCrewMemberButton').on('click',  function(e){
                e.preventDefault();

                //input auslesen
                let Temmemberupdate = {
                    id:userId,
                    newvn : $(' #CrewmemberfirstnameInput').val(), 
                    newnn : $(' #CrewmemberlastnameInput').val(),
                    newmail : $(' #CrewmemberemailInput').val(),
                    newnumber : $(' #CrewmembernumberInput').val(),
                    login:true,
                    projectsId: $('#project2member'),
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
                    $(userIdfeld).html(userId)
                    $('.delUser').html('delete');
                    $('.editUser').html('edit');

                    //userupdate zum server, damit der im json updaten kann
                    $.ajax({ 
                        url: 'regie/crewmemberlist/' + userId,
                        method: 'put', 
                        data: JSON.stringify(Temmemberupdate),
                        contentType:'application/json',
                        success:function(res){
                            console.log(userId)
                            console.log(Temmemberupdate.id)
                        },
                        error:function(){
                            console.log(userId, 'error')
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
        $(this).hide();
        let $clicked = $(this).parent() //<tr>
        userId = $(this).parent().children().next().next().next().next().next().html();

        let Temmemberupdate = {
            login:true
        }
        
        $.ajax({ 
            url: 'regie/allow/' + userId,
            method: 'put', 
            data: JSON.stringify(Temmemberupdate),
            contentType:'application/json',
            success:function(res){
                console.log('user can now acess your current project')
                $('<td>').append('<button>').attr({"class":"btn btn-primary editUser"}).html('edit').appendTo($clicked);
                $('<td>').append('<button>').attr({"class":"btn btn-danger delUser"}).html('delete').appendTo($clicked);
                Edit()
                Del()
            },
            error:function(){
                console.log(userId, 'error')
            }
        })//ende ajax

       //Edit();
        //saveEditedUser()//hier ist login auf true wenn ändern sowieso 
    })//end onclick
}//ende allowfunction

//// DELETE USER ////////
function Del(){
    $('.delUser').on('click', function(e){
        e.preventDefault();
        delUserId = $(this).parent().children().next().next().next().next().next().html();
        let clickedElement = $(this).parent().children().next(); 
        console.log(delUserId)
        //INHALT
        $.ajax({
            url:'regie/crewmemberlist/' + delUserId,
            method: 'delete',
            success:function(res){
                //window.onloadstart();
                console.log('server erfolgreich')
                clickedElement.parent().remove();
                console.log(delUserId)
                // window.open("http://localhost:5555/regie","pills-contact");
                // win.location.reload();

                window.tabs.reload(
                    "http://localhost:5555/regie", "pills-contact"
                  )
                  
            },
            error:function(){
                console.log('delete XHR ERROR')
            }
        })//end ajax
    })//end onclick
}//ende delfunction

//JSON CREWFILE Push crewmembers in tr for each 
$.ajax({ // projekt daten in den user unter projekte speichern
    url: 'regie/crewmemberlist',
    method: 'get',
    success:function(data){
            //let allTeammembers =  {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]};
            allTeammembers = data;
            allTeammembers.crewMembers.forEach(einzelner => {
                makeUsertable(einzelner);
                index = allTeammembers.crewMembers.indexOf(einzelner);
             })
             //console.log(jeder, 'jeder')
             //let arr = ['luz','zwei', 'orange']
         
            Edit();
            Del();
            Allow();
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
        $('<td>').html(index).appendTo($tr) //mit foreach zählen countvariable?
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

    //save 
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
            success:function(res){
                console.log('user wurde hinzugefügt')
            },
            error:function(){
                console.log('adduser XHR ERROR')
            }
        });//ende ajax
     });//end save onclick
});//ende addUser onclick










