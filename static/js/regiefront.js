
//bekomme von login seccion.
var user = sessionStorage.getItem('user');
console.log(1, user)
if(!user || user == ''){
    //keine seccion 
    top.location.href = '/login';
}
// 1. finde user id aus seccion oder response??
user = JSON.parse(user);

let projects = user.projects.length > 0; //true/false

let userrole;

// hat er projekte wenn nein ist er user
if(!projects){
    userrole = 'user';
} else {
    //ist er admin von den projekten
    if(actualUserId.projectsId.role == 'admin'){
        userrole = 'admin';
    } else{
        userrolle = 'user';
    }
}

//1. ist er admin eines Projekts?
        if(userrole == "admin"){ //regie = schauspielagentur überblick über alle user und projekte
        // nichts machen alle projekte gehören ihm und kann sie verwalten
        //profilbild
        $('.profilbild').attr('src', '../img/regie.png')

        } else { //user
            // hide userlist & disable edituser functions

            // usertab none
            $('pills-contact-tab').hide()
            $('.profilbild').attr('src', '../img/user.png');
            //user kann keine projekte anlegen
            $('#createNewProj').hide();
            $('#createpro').html('Project Overview')
            // emty filmcards um nur die projekte des users zu rendern
            $('#projectlist').empty();
            // 2. render nur seine projekte in projects
            function getProjectsofperson(){// success: makeFilmcards() & ProjectSettings()
                $.ajax({ 
                    url:'regie/projectsofperson',
                    method:'get',
                    data: {id:user.userId},
                    success:function(data){
                        //1card/film
                        data = JSON.parse(data)
                        function makeIndividualFilmcards(){
                            data.projects.forEach(einzelnes => {
                                //console.log(einzelnes,'jeder einzelne film)
                                let filmTitile = einzelnes.title;
                                let filmSynopsis = einzelnes.syn;
                                let filmId = einzelnes.id;
                        
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
                        }//end make individual filmcards
                        makeIndividualFilmcards(data)
                    
                    },//end success
                    error:function(){
                        console.log('XHR error get filmlist')
                    }
                })//ende fill filmcards
            }

             // darf projekte nicht editieren
             $('.projectsettings').hide();
            $('#ProjNews').html('you can see your news of the current Project here with the Pro version')
        }

//1. nur sein profil
$('loggedinName').html(userobj.vorname);
