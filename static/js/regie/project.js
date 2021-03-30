

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

//Edit Proj --> modal opens projectuser loading
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
        // div wo alle user deren filmid dessen entspricht
        $('.choosenmembers').show();

        //get users find in every user film in every film find this id take this userid pushe in array
        let UsersOfProj = [];
        //suche alle user mit der filmid!!!! und pushe in let UsersOfProj = [];
        $.ajax({
            url:'/regie/crewmemberlist',
            method:'get',
            success:function(data){
                data.crewMembers.forEach(function(member){ //eachmember
                    //member.projectsId.find(function(filmId){
                        //
                        //UsersOfProj.push(member.id)
                    //})
                    member.projectsId.forEach(function(projectsofeachmember){ // [all projects ]

                        let filmIdInProjofEachmember = projectsofeachmember.filmid; // {}{}{} each project id
                        console.log(projectsofeachmember, 'projofeachmemb')
                        //of filmidof memeber == same as onclick filmId
                        //dann pushe in array bzw..
                        if(filmIdInProjofEachmember == projectsId){
                            console.log(member.id, 'this inside filmIdofEachmember', projectsId)
                            //diese memberid die projectid beinhaltet
                            //projectsofeachmember.rightId.parent
                            UsersOfProj.push()
                        }//end if projectId vorkommt
                    })//ende foreach project in member
                })//ende foreach member
            },//ende success
            error:function(){
                console.log('getuser 4 check filmid in Projectsettings XHR')
            }
        })//end ajax
        // modal daten auslesen
        // zu usern projektid fügen
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
        
                                    //alle users die aus dem array wieder entfernt werden
                                    let deletedUsersOfProj = [];
        
                                    $('<div>')
                                            .html(name)
                                            .attr({"data-id":id})
                                            .appendTo('.choosenmembers')
                                            .on('click', function(index){
                                                this.remove();
                                                let todelete = $(this).attr('data-id')
                                                deletedUsersOfProj.push(todelete)
                                                console.log(deletedUsersOfProj,'deleted')
                                                //id mitgeben 
                                                //checkBySave
                                                //removeUserFromArray(id);
                                                //hier data attr wieder entfernen
                                            });
                                            //console.log(choosenmembers, 'choosenmembers after splice')
                                })
                            }//e addMember()
                            addMember()
                    },
                    error:_=>{
                        console.log('XHR getmembers for projectupdate')
                    }
            });//end ajax
        }// end Memberselect
        Memberselect()

        //BUTTONS im modal
        //save prj changes in modal
        // im ProjectSettings() // Save Ajax Update JSON of project
        function SaveChanges(projectsId){//Id von Projectsettings weil onclick auf einzelnen flm
            // von delete: let projectsId = $('#projectlist').children().attr('data-filmid')
            console.log(projectsId)

            $('#saveNewProject').on('click', function(e){
                e.preventDefault();
                $('#newProjModal').modal('hide')
                
                function choosenMember(){
                    let choosenmembers = [];
                    // nur wenn im .coosenmembersdiv was drinnen ist -> update dessen user & sowiso proj
                    // wenn nicht -> update nur proj
                    if($('.choosenmembers').children().length > 0){ //wenn berreits user d proj vorhanden
                        console.log('befüllt')
                        // 1. hole alle divs aus choosen member,
                        $('.choosenmembers div').each(function(each){
                            //wenn noch kein div mit diesem div vorhanden
                            // schon divs drinnen?(wenn modal berreits offen 1person nur einmal in div fügen)
                            //if(each != ){
                            // lese data-id aus und pushe sie einzeln in array
                            choosenmembers.push($(this).attr('data-id'));
                        // } else {
                            // console.log('user schon vorhanden')
                            //}
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
                        console.log(choosenmembers, 'coosenmember []')
                        //immer wenn user weggeklickt im divonclick aufgerufen
                        function removeUserFromArray(){
                            //id des users wird mitgegeben
                            choosenmembers.forEach(function(each, index){
                                if(each == id){
                                    console.log(each, id,'wenn die id die übergeben wurde mit einer im array übereinstimmt lösche')
                                    let gefunden = indexOf(each);

                                    choosenmembers.splice(gefunden);
                                }
                            })
                        }//removeUserFromArray
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
        $('.choosenmembers').hide();
        
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
