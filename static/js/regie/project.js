//_______________________________________________//
//_______________________________________________//
/////////////////// Project TAB ///////////////////
//_______________________________________________//


let saveProjCount = 0;
let Projecttitle;
//let projectsId;

function makeFilmcards(data){
    data.projects.forEach(einzelnes => {
        //console.log(einzelnes,'jeder einzelne film)
        let filmTitile = einzelnes.title;
        let filmSynopsis = einzelnes.syn;
        let filmId = einzelnes.id;
        //"img":"titelbild1.jpeg"
        let img = einzelnes.img;

        let html = `
        <img class="card-img-top" src="/uploads/images/titelbild1.jpeg" alt="Film img">
        <div class="card-body">
            
            <h5 class="card-title">${filmTitile}</h5>
            <p class=" synopsis">${ filmSynopsis }</p>
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

        let sendIdOfFilmForUsers = projectsId.filmid;
        console.log(projectsId, sendIdOfFilmForUsers, 'projectsid aus click')


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
        $('.choosenmembers').html('');

        //all users mit der filmId (bei editproj onclick bestimmt)
        let choosenmembers = []; //alle die bei save mitgeschickt werden

        $.ajax({
            url:'/regie/memberofproj',
            method:'get', //post filmid res = alle user, die filmid beinhalten
            data:JSON.stringify(sendIdOfFilmForUsers),//BACKEND --> hole alle user mt der filmid 
            contentType:'application/json',
            success:function(data){
                console.log(data, 'members of project')
                //wenn membersofproj (rücksendunng )nicht emty, //[{username:name, userid:id},{username:name, userid:id}]

                if(data >= 0){
                    //alle diese user in choosenmembers
                    data.foreach(function(vorhandene){           
                         choosenmembers.push(vorhandene)  //einzelner user {name, id}
                    })
                }
            }, //ende success
            error:function(){
                console.log('get memberoid of proj XHR')
            }
        })//end ajax 

        if(choosenmembers >= 0){
            let name = choosenmembers.name;
            let id = choosenmembers.id;
            //alle aus choosenmembers noch vorm savebutton ins div!!
            appendmemberinDiv(name, id)
        }

        function appendmemberinDiv(name, id){
            $('<div>')
                .html(name)
                .attr({"data-id":id})
                .appendTo('.choosenmembers')
                .on('click', function(){
                    this.remove();
                    // div wird entfernt, so bei save nicht mehr in den array gepusht, 
                    //der in JSON dafür verantwortlich ist, dass diese user mit der ID die filminstanz bekommen
                });
        } 

       

        // modal beefüllen mit filmdaten
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
                                    <button class="btn btn-outline-secondary appendmemberinDiv" type="button">Add Member</button>
                                    </div>                                
                                    `;
                        $('.userselect').html(html);
    
                        data.crewMembers.forEach((einzelner) => {
                            let vname = einzelner.vorname;
                            $('<option>').val(einzelner.id).html(vname).appendTo('#memberselect')
                            //console.log(einzelner.vorname)
                        });
                        console.log(data)


                        // button neben user select (append user to div)
                        function addMember(){
                            $('.appendmemberinDiv').on('click', function(){
                                //reset selected
                                $(this).html('add')
                                //finde den einen ausgewählten..
                                
                                //selected auf neue option
                                //member und id aus imputfeld auslesen                       
                                let id = $('#memberselect option:selected').val();
                                let name = $('#memberselect option:selected').html();
                                console.log(id, name, 'füge in memberdivs')
                                // als div unter button speichern
    
                                let Vorhanden = false;
                                $('.choosenmembers div').each((j, div) => {
                                    if($(div).attr("data-id") == id) {
                                        Vorhanden = true;
                                    } 
                                })
                                if(!Vorhanden){
                                    console.log('Wurde noch nicht hinzugefügt')
                                    appendmemberinDiv(name,id)
                               
                                } else {
                                    console.log('user wurde schon hinzugefügt')
                                }
                            })//end appendmember in div
                        }//e addMember()
                        addMember()
                    }, //ende success -> save projekt in user
                    error:_=>{
                        console.log('XHR getmembers for projectupdate')
                    }
            });//end ajax
        }// end Memberselect
        Memberselect(choosenmembers)
        SaveChanges(choosenmembers)


        // savebutton im modal der ProjectSettings() aus onclick auf einzelnen flm
        function SaveChanges(){
            $('#saveNewProject').on('click', function(e){
                e.preventDefault();
                $('#newProjModal').modal('hide');
                choosenmembers = []//leereen
                function updateChoosenmembers(){ // zu usern projektid fügen
                    // nur wenn im .coosenmembersdiv was drinnen ist -> update dessen user & sowiso proj
                    let members = $('.choosenmembers').children().length >= 0;
                    console.log(members,'members true/false?')//true wenn 1ner hinzugefügt

                    if(members){ //wenn berreits user d proj vorhanden
                        console.log('befüllt')
                        // 1. hole alle divs aus choosen member,
                            $('.choosenmembers div').each((j, divcnames) => { //each braucht 2 parameter!!
                                choosenmembers.push($(divcnames).attr('data-id'));    
                            }); 
                        console.log( choosenmembers, 'choosenmembers nach push of divnames') // wo ist undefined her??

                        let userUpdate = {
                            ids: choosenmembers,
                            filmId: projectsId,
                        } //console.log(projectsId, 'projectsid')

                        //AJAX post Array am server durchlaufen, alle personen == id projektid hinzufügen 
                         //eigene route
                            //divtags nur dataids in aray -> schick ich mit
                            $.ajax({ //array von Ids möglich?
                                url: '/regie/addusertoproject',
                                method: 'post',
                                //type:'POST',
                                data:JSON.stringify(userUpdate),// array mit ids vom user
                                contentType:'application/json',
                                // dataType: 'json', 
                                success:function(res){
                                    console.log('post addusertoproject works', res)
                                // UpdateProjectsInUser()  im success der
                                },
                                error:function(){
                                    console.log('XHR proj2member')
                                }
                            // server foreach 
                            // personen finde eine mit der id und dort 
                            }); //                        
                        //console.log(choosenmembers, 'added')
                    } else {
                        console.log('keine user hinzugefügt')
                    }
                }//ende choosen member
                updateChoosenmembers(choosenmembers)
                
                // UPDATE FILM DB
                function Projectupdate(){
                    let projUpdate = {
                        newtitle : $('#newProjectTitle').val(),
                        newsyn: $('#newProjSynopsis').val(),
                        //titelBild:$('.titelBild').val(),
                    };
                    updateProjId = projectsId.filmid;   //projectsId sollte nur projects heißen filmId ist   
                    console.log(updateProjId,'updateProjId')
                    $.ajax({
                        url:'/regie/projects/' + updateProjId, //2projids?
                        method:'put',
                        data:JSON.stringify(projUpdate),
                        contentType: 'application/json',
                        success:function(res){
                            console.log('film was updated') 
                            // var windoeandTab = widow.open('http://localhost:5555/regie', 'pills-project') ;
                            // windoeandTab.location.reload(true);
                            // location.reload();
                            // window.location.reload(true)
                            //Location.reload(forcedReload: true);
                            //location.load(true) 
                            console.log(res) //updated projectid
                        },
                        error:function(){
                            console.log('aenderungen konnten nicht gespeichert werden')
                        }
                    })//ende ajax
                }//ende projupdate
                Projectupdate();

            })//end onclick
        }//end updateProj
        //SaveChanges(projectsId, choosenmembers);
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

                // remove gesammte projektinstanz aus dem user!!
                function removeProjectinstance(){
                    $.ajax({ //enferne allen usern die zu löschende projektid
                        url:'/regie/delprojusers/' + projectsId,
                        method:'delete',
                        success:function(res){
                            console.log('server erfolgreich del projinstance')
                        },
                        error:function(){
                            console.log('server fehlgeschlagen del projinstance')
                        }      
                    })//ende ajax
                }//ende    removeProjectinstance() 
                removeProjectinstance(projectsId)
                // reload page
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
