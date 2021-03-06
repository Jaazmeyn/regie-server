var user = sessionStorage.getItem('user');
user = JSON.parse(user);

let saveProjCount = 0;
let Projecttitle;
//let projectsId;

function makeFilmcards(projects){
    projects.forEach(einzelnes => { //data = data.project
        //console.log(einzelnes,'jeder einzelne film)
        let filmTitile = einzelnes.title;
        let filmSynopsis = einzelnes.syn;
        let filmId = einzelnes.id;

        let html = `
        <img class="card-img-top" src="/uploads/images/titelbild1.jpeg" alt="Film img">
        <div class="card-body">
            
            <h5 class="card-title">${filmTitile}</h5>
            <p class=" synopsis">${ filmSynopsis }</p>
            <div class="onlyadmin"></div>
            <a class="btn btn-primary projectsettings">Project Settings</a>

        </div>`;
        
        $('<div>').html(html).attr({
            'class': 'card',
            "data-filmId": filmId,
            "style":"width: 18rem",
        }).appendTo('#projectlist')
    })
    if(projects != 0){
        $('#current-projectTitle').html('current project: '+ projects[0].title)
        $('#createpro').html('create a new one')
    }
}//end make filmcards



function Projects(){ // success: makeFilmcards() & ProjectSettings()
    if(user.projects.length > 0){ //session user hat projekte
        if(user.projects[0].role == 'admin'){   //session user ist admin: hat alle projekte
            $.ajax({ 
                url:'regie/projects',
                method:'get',
                contentType:'application/json',
                success:function(data){
                    //1card/film
                    data = JSON.parse(data)
                    projects = data.projects;
                    makeFilmcards(projects)
                    ProjectSettings()
                },//end success
                error:function(){
                    console.log('XHR error get filmlist')
                }
            })//ende fill filmcards regie
        } else { //user
            // nur Projekte des users rendern
            $('.projectsettings').hide();           
            $.ajax({ 
                url:'regie/projects', //hole alle projekte
                method:'get',
                contentType:'application/json',
                success:function(data){ 
                    //1card/film
                    data = JSON.parse(data)
                    let userprojektids;
                    let projects = [];
                    if(user.projects.length > 1){ // user hat projekte
                        //userprojektids
                        user.projects.filter(item => {
                            iterateObj(item);
                        })
                        //alle user projekte
                        //user filmid in array als variable
                        function iterateObj(obj, prop){
                            for(prop in obj ){
                                if(typeof(obj[prop]) == "object"){
                                    iterateObj(obj[prop]);
                                } else {
                                    if(prop == "filmid"){ //ende wenn kein obj mehr prop is
                                        userprojektids = obj[prop];
                                        data.projects.forEach(eachpr => {//alle proj
                                            if(eachpr.id == userprojektids){
                                                //jedes Proj als obj
                                                projects.push(eachpr)
                                            }
                                        })
                                    }//end if filmid
                                }//end else
                            } //end for in
                        }//iterate
                        console.log(projects,'userprojektids', data)
                    } else { //wenn user nur einen film hat
                        userprojektids = user.projects[0].filmid;
                        data.projects.forEach(oneproj => { //alle projekte durch und selben wie d users finden
                            if(oneproj.id == userprojektids){
                                //jedes Proj als obj
                                projects.push(oneproj)
                            }
                        })
                        console.log(projects)
                    }
                    console.log(data, 'data')
                    makeFilmcards(projects)
                   
                },//end success
                error:function(){
                    console.log('XHR error get filmlist')
                }
            })//ende fill filmcards user
        };
    } else {
        console.log('user hat keine projekte')

    };
} Projects() 
// Edit Proj --> modal opens projectuser loading


////////////// SETTINGS MODAL ////////////////////
function ProjectSettings(){ //Memberselect() &  updateProj(); //ID!!!!
    $('.projectsettings').on('click', function(e){
        e.preventDefault();
        //gib dem savebutton andere Id 
        //damit nicht 2mal gespeichert wegen selben modal newproject und edit project

        let clicked = this; //button
        let clickedElement = $(this).parent().parent() 
        let projectsId = $(clicked).parent().parent().data(); 
  
        let sendIdOfFilmForUsers = projectsId; //funktioniert

        let clickedTitle = $(clicked).parent().children().html()
        let clickedSyn = $(clicked).parent().children().next().html()

        $('#newProjModal').modal('show')
        // modal bef??llen & ??ndern

        $('#projsettings').html('Update Project')
        $('#saveNewProject').html('Save changes');

        $('#newProjectTitle').val(clickedTitle);

        console.log(sendIdOfFilmForUsers, clickedTitle,'title')
        $('#newProjSynopsis').val(clickedSyn);
        $('#deleteProj').show();
        // div wo alle user deren filmid dessen entspricht
        $('.choosenmembers').html('');

        //all users mit der filmId (bei editproj onclick bestimmt)

        $.ajax({ //hole alle members des projekts
            url:'/regie/memberofproj',
            method:'post', //post filmid res = alle user, die filmid beinhalten
            data:JSON.stringify(sendIdOfFilmForUsers),//BACKEND --> hole alle user mt der filmid 
            contentType:'application/json',
            success:function(res){//[{username:name, userid:id},{username:name, userid:id}]

                if(res.length > 0){ // wenn projekte 
                    res.forEach(function(vorhandene){    
                        console.log(vorhandene,'more users of project mitgeschickt')
                        let name = vorhandene.vorname;
                        let id =  vorhandene.id;
                        appendmemberinDiv(name, id)
                    })
                } else if(res.length = 0){
                        // choosenmembers.push(res)
                        console.log(1,'projekt hat 1nen user')
                        let name = res.vorname;
                        let id = res.id;
                        appendmemberinDiv(name, id)
                } else {
                    console.log('keine user mitgeschickt')
                }

            }, //ende success
            error:function(){
                console.log('get memberid of proj XHR')
            }
        })//end ajax 
        function appendmemberinDiv(name, id){
            $('<div>')
                .html(name)
                .attr({"data-id":id})
                .appendTo('.choosenmembers')
                .on('click', function(){
                    this.remove();
                    // div wird entfernt, so bei save nicht mehr in den array gepusht, 
                    //der in JSON daf??r verantwortlich ist, dass diese user mit der ID die filminstanz bekommen
                });
        } 
       
        // modal beef??llen mit filmdaten
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
                        //console.log(data, 'all crewmembers)


                        // button neben user select (append user to div)
                        function addMember(){
                            $('.appendmemberinDiv').on('click', function(){
                                //reset selected
                                $(this).html('add')
                                //finde den einen ausgew??hlten..
                                
                                //selected auf neue option
                                //member und id aus imputfeld auslesen                       
                                let id = $('#memberselect option:selected').val();
                                let name = $('#memberselect option:selected').html();
                                console.log(id, name, 'f??ge in memberdivs')
                                // als div unter button speichern
    
                                let Vorhanden = false;
                                $('.choosenmembers div').each((j, div) => {
                                    if($(div).attr("data-id") == id) {
                                        Vorhanden = true;
                                    } 
                                })
                                if(!Vorhanden){
                                    console.log('Wurde noch nicht hinzugef??gt')
                                    appendmemberinDiv(name,id)
                               
                                } else {
                                    console.log('user wurde schon hinzugef??gt')
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
        Memberselect()
        SaveChanges()


        // savebutton im modal der ProjectSettings() aus onclick auf einzelnen flm
        function SaveChanges(){
            $('#saveNewProject').on('click', function(e){
                e.preventDefault();
                $('#newProjModal').modal('hide');
                let choosenmembers = [];

                function updateChoosenmembers(){ // zu usern projektid f??gen
                    // nur wenn im .coosenmembersdiv was drinnen ist -> update dessen user & sowiso proj
                    let members = $('.choosenmembers').children().length >= 0;
                    console.log(members,'members true/false?')//true wenn 1ner hinzugef??gt

                    if(members){ //wenn divs da
                        console.log('bef??llt')
                        // 1. hole alle  divs(members) aus html,
                            $('.choosenmembers div').each((j, divnames) => { //each braucht 2 parameter!!
                                choosenmembers.push($(divnames).attr('data-id'));    
                            }); 
                        console.log( choosenmembers, 'choosenmembers nach push of divnames') // wo ist undefined her??

                        let userUpdate = {
                            ids: choosenmembers,
                            filmId: projectsId,
                        } //console.log(projectsId, 'projectsid')

                        //AJAX post Array am server durchlaufen, alle personen == id projektid hinzuf??gen 
                         //eigene route
                            //divtags nur dataids in aray -> schick ich mit
                            $.ajax({ //array von Ids m??glich?
                                url: '/regie/addusertoproject',
                                method: 'post',
                                //type:'POST',
                                data:JSON.stringify(userUpdate),// array mit ids vom user
                                contentType:'application/json',
                                // dataType: 'json', 
                                success:function(res){
                                    console.log('post addusertoproject works', res)
                                    //top.location.href = '/regie';

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
                        console.log('keine user hinzugef??gt')
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
                    let updateProjId = projectsId.filmid;   //projectsId sollte nur projects hei??en filmId ist   
                    console.log(updateProjId,'updateProjId')
                    $.ajax({
                        url:'/regie/projects/' + updateProjId, //2projids?
                        method:'put',
                        data:JSON.stringify(projUpdate),
                        contentType: 'application/json',
                        success:function(res){
                            console.log('film was updated') 
                            //top.location.href = '/regie';

                            console.log(res) //updated projectid
                        },
                        error:function(){
                            console.log('aenderungen konnten nicht gespeichert werden')
                        }
                    })//ende ajax
                }//ende projupdate
                Projectupdate(projectsId);
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
                    $.ajax({ //enferne allen usern die zu l??schende projektid
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
                console.log('l??schen XHR projekt')                
            }
        })//ende Ajax
    })//end click
} // in Projectsettings aufgerufen



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
                current: false, //erst nach button curren = active in der ??bersicht radiobutton besser da kann man nur ens w??hlen
            }
            $('#newProjModal').modal('hide');
            console.log(newProject)
    
            $.ajax({ // projekt daten in den user unter projekte speichern
                url: '/regie/newproject',
                method: 'post',
                data: JSON.stringify(newProject), //<- vom server in json gespeichert
                contentType:'application/json',
                success:( res ) => {
                    console.log('projekt wurde in die datenbank gef??gt')
                },
                error:() => {
                    console.log('XHR ERROR')
                }
            })//end ajax
        })//ende save proj onclick
    })//ende createnewproj onclick
} NewProject()
