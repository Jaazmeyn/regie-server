//_______________________________________________//
/////////////////// USER TAB //////////////////////

let allTeammembers, userId, index;
let jeder = []; //einzelner ist objekt in array


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
        $.ajax({
            url:'/regie/projects',
            method:'get',
            success:function(res){
                res = JSON.parse(res),
                // let projectsOfThatMember = data.crewMembers.projectsId[id];
                res.projects.forEach(function(each){
                    let projecttitle = each.title;
                    projectsId = each.id; console.log('projectid !!!- - - - - - ', projectsId)
                    console.log(projecttitle)
                    $('<option>').html(projecttitle).attr({'data-cmProject': projectsId }).appendTo('#project2member')
                })//im edituser aufgerufen
                // $('#saveNewCrewMemberButton').on('click',  function(e){
                //     e.preventDefault();

                //     $.ajax({
                //         url:'/regie/saveproject2user/:id',
                //         method:'put',
                //         data:JSON.stringify()
                //     })
                // })
            },
            error:function(){
                console.log('projects XHR error')
            }
        })

    })
     
}
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












//_______________________________________________//
//_______________________________________________//
/////////////////// Project TAB ///////////////////
//_______________________________________________//


let saveProjCount = 0;
let Projecttitle, projectsId;

function makeFilmcards(data){
    data.projects.forEach(einzelnes => {
        console.log(einzelnes)
        let filmTitile = einzelnes.title;
        let filmSynopsis = einzelnes.syn;
        let filmId = einzelnes.id;
        //"img":"titelbild1.jpeg"
        let img = einzelnes.img;

        let html = `
        <img class="card-img-top" src="/uploads/images/titelbild1.jpeg" alt="Film img">
        <div class="card-body">
            <h5 class="card-title">${filmTitile}</h5>
            <p class="card-text synopsis">${ filmSynopsis }Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a class="btn btn-primary projectsettings">Project Settings</a>
        </div>`;
        
        $('<div>').html(html).attr({
            'class': 'card',
            "data-filmId": filmId,
            "style":"width: 18rem",
        }).appendTo('#projectlist')
    })
    if(data.projects != 0){
        $('#current-projectTitle').html('current project: '+ data.projects[0].title)
        $('#createpro').html('create a new one')
    }
}//end make filmcards



/////////////////// SETTINGS MODAL //////////////////////

//im ProjectSettings()
function Memberselect(){ 
    $.ajax({ // projekt daten in den user unter projekte speichern
            url: 'regie/crewmemberlist',
            method: 'get',
            success:function(data){
                    //let allTeammembers =  {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]};
                    let html = `
                                <select class="custom-select" id="memberselect">
                                <option selected>Film Crew...</option>
                                </select>
                                <div class="input-group-append">
                                <button class="btn btn-outline-secondary appendmemberinArr" type="button">Add Member</button>
                                </div>                                
                                `;
                    $('.userselect').html(html);

                    data.crewMembers.map((einzelner) => {
                        let vname = einzelner.vorname;
                        $('<option>').val(einzelner.id).html(vname).appendTo('#memberselect')
                        //console.log(einzelner.vorname)
                    });
                    console.log(data)
                    // button neben user select (append user to div)
                    function addMember(){
                        $('.appendmemberinArr').on('click', function(){
                            //reset selected
                            $(this).html('add')
                            //finde den einen ausgewählten..
                            
                            //selected auf neue option
                            //member und id aus imputfeld auslesen                       
                            let id = $('#memberselect option:selected').val();
                            let name = $('#memberselect option:selected').html();
                            console.log(id, name, 'füge attribut in ausgewählte memberdivs')
                            // als div unter button speichern
                            $('<div>')
                                    .html(name)
                                    .attr({"data-id":id})
                                    .appendTo('#choosenmembers')
                                    .on('click', function(index){
                                        this.remove();
                                    });
                                    //console.log(choosenmembers, 'choosenmembers after splice')
                        })
                    } addMember()
            },
            error:_=>{
                console.log('XHR getmembers for projectupdate')
            }
    });//end ajax
}// end Memberselect

// im ProjectSettings() // Save Ajax Update JSON of project
function SaveChanges(projectsId){//Id von Projectsettings weil onclick auf einzelnen flm
    // von delete: let projectsId = $('#projectlist').children().attr('data-filmid')
    console.log(projectsId)

    $('#saveNewProject').on('click', function(e){
        e.preventDefault();
        $('#newProjModal').modal('hide')
        
        function choosenMember(){
           
            let choosenmembers = [];
            if($('#choosenmembers').children().length > 0){
                console.log('befüllt')
                // 1. hole alle divs aus choosen member,
                $('#choosenmembers div').each(function(){
                    // lese data-id aus und pushe sie einzeln in array
                    choosenmembers.push($(this).attr('data-id'));
                }); console.log( choosenmembers)

                let userUpdate = {
                    ids: choosenmembers,
                    filmId: projectsId,
                } //console.log(projectsId, 'projectsid')

                //AJAX post Array am server durchlaufen, alle personen == id projektid hinzufügen 
                function Project2Member(){ //eigene route
                    //divtags nur dataids in aray -> schick ich mit
                    $.ajax({ //array von Ids möglich?
                        url: '/regie/addusertoproject',
                        method: 'post',
                        //type:'POST',
                        data:JSON.stringify(userUpdate),// array mit ids vom user
                         contentType:'application/json',
                        // dataType: 'json', 
                        success:function(res){
                            console.log('post addusertoproject works')
                         // UpdateProjectsInUser()  im success der
                        },
                        error:function(){
                            console.log('XHR proj2member')
                        }
                    // server foreach 
                    // personen finde eine mit der id und dort 
                    }); //
                }//end update userprojects
                Project2Member();
            } else {
                console.log('keine user hinzugefügt')
            }
            function Projectupdate(){
                let projUpdate = {
                    newtitle : $('#newProjectTitle').val(),
                    newsyn: $('#newProjSynopsis').val(),
                    //titelBild:$('.titelBild').val(),
                };
                projectsId = projectsId.filmid;
                
                $.ajax({
                    url:'/regie/projects/' + projectsId,
                    method:'put',
                    data:JSON.stringify(projUpdate),
                    contentType: 'application/json',
                    success:function(res){
                        console.log('film was updated')
                        //UpdateProjectsInUser()///!!!
                        
                    },
                    error:function(){
                        console.log('aenderungen konnten nicht gespeichert werden')
                    }
                })
                    // // alle 'ausgelesen ids aus selects';
                    // let crewmembersval = $('#coosenmembers').val();//membersid  
                    // crewmembers = [crewmembersval];
                    // crewmembers.push()
                    // crewmembers.forEach(element => {
                    // });
            }//ende projupdate
            Projectupdate();


        }
        choosenMember()




    })//end onclick
}//end updateProj

//Edit Proj
function ProjectSettings(){ //Memberselect() &  updateProj(); //ID!!!!
    $('.projectsettings').on('click', function(e){
        e.preventDefault();
        //gib dem savebutton andere Id 
        //damit nicht 2mal gespeichert wegen selben modal newproject und edit project

        let clicked = this; //button
        let clickedElement = $(this).parent().parent() 
        let projectsId = $(clicked).parent().parent().data(); 
        
        let clickedTitle = $(clicked).parent().children().html()
        let clickedSyn = $(clicked).parent().children().next().html()

        $('#newProjModal').modal('show')
        // modal befüllen & ändern

        $('#projsettings').html('Update Project')
        $('#saveNewProject').html('Save changes');

        $('#newProjectTitle').val(clickedTitle);
        $('#newProjSynopsis').val(clickedSyn);
        $('#deleteProj').show();
        $('#choosenmembers').show();
        // modal daten auslesen
        // zu usern projektid fügen
        Memberselect()

        //BUTTONS im modal
        //save prj changes in modal
        SaveChanges(projectsId);
        DeleteProject(clickedElement)//wenn on click

    })// ende projectsettings
}//ende changeproj

//Delete Proj
function DeleteProject(clickedElement){
    $('#deleteProj').on('click', function(){
        let projectsId = $('#projectlist').children().attr('data-filmid')
        

        //console.log(projectsId)

        $.ajax({
            url:'/regie/projects/' + projectsId,
            method: 'delete',
            success:function(res){
                //window.onloadstart();
                console.log('server erfolgreich')
                $('#newProjModal').modal('hide');
                $(clickedElement).remove()
                //reload page
            },error:function(){
                console.log('löschen XHR projekt')                
            }
        })//ende Ajax
    })//end click
}

function getProjects(){// success: makeFilmcards() & ProjectSettings()
    $.ajax({ 
        url:'regie/projects',
        method:'get',
        success:function(data){
            //1card/film
            data = JSON.parse(data)
            makeFilmcards(data)
            ProjectSettings()
        
        },//end success
        error:function(){
            console.log('XHR error get filmlist')
        }
    })//ende fill filmcards
}
getProjects()



    

function NewProject(){
    $('#createNewProj').on('click', function(e){
        $('#newProjModal').modal('show');
        $('#newProjectTitle').val('');
        $('#newProjSynopsis').val('');
        $('#saveNewProject').html('Save');
        $('#deleteProj').hide();
        $('#choosenmembers').hide();

        

        $('#closeProjectModal').on('click', _=>  $('#newProjModal').modal('hide'));
    
        //save Projects in JSON
        $('#saveNewProject').on('click', function(e){
            e.preventDefault();
            saveProjCount++;
            let id = ($('#newProjectTitle').val() + (Math.random().toString())).replace(' ','_');
    
            let newProject = {
                title: $('#newProjectTitle').val(),
                syn: $('#newProjSynopsis').val(),
                id: id,
                pfad: $('.titelBild').val(),
                current: false, //erst nach button curren = active in der übersicht radiobutton besser da kann man nur ens wählen
            }
            $('#newProjModal').modal('hide');
            console.log(newProject)
    
            $.ajax({ // projekt daten in den user unter projekte speichern
                url: '/regie/newproject',
                method: 'post',
                data: JSON.stringify(newProject), //<- vom server in json gespeichert
                contentType:'application/json',
                success:( res ) => {
                    console.log('projekt wurde in die datenbank gefügt')
                },
                error:() => {
                    console.log('XHR ERROR')
                }
            })//end ajax
        })//ende save proj onclick
    })//ende createnewproj onclick
}
NewProject()
