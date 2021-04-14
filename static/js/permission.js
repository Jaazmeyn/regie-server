
//bekomme von login seccion.
var user = sessionStorage.getItem('user');
// actualUserId: (2) […]​​
// 0: Object { filmid: "La_film_alafilm0.48659407252494113", role: "admin", job: "co-regisseur", … }
// 1: Object { filmid: "Ocean_50.2640623593281143", role: "admin", job: "co-regisseur", … }
// userId: "0.08252274624100397"
// username: "Carlo"
// 1. finde user id aus seccion oder response??
user = JSON.parse(user);
//console.log(user)
console.log(1, user)

$('#pills-logout-tab').on('click', function(){
    alert('logout?')
    top.location.href = '/login';
    sessionStorage.clear()
})

if(!user || user == null){
    //keine seccion 
    top.location.href = '/login';
    sessionStorage.clear()
} 


let projectsboolan = user.projects.length > 0; //true/false
let projects = user.projects;
let userrole;

// hat er projekte wenn nein ist er user
if(!projectsboolan){
    userrole = 'user';
} else {
    //ist er admin von den projekten
    if(projects[0].role == 'admin'){
        userrole = 'admin';
    } else {
        userrolle = 'user';
    }
}

//1. ist er admin eines Projekts?
        if(userrole == 'admin'){ //regie = schauspielagentur überblick über alle user und projekte
            // nichts machen alle projekte gehören ihm und kann sie verwalten
            //profilbild
            $('.profilbild').attr('src', '../img/regie.png')

        } else { //user
            // hide userlist & disable edituser functions
            // usertab none
            $('#pills-contact-tab').hide()
            $('.profilbild').attr('src', '../img/user.png');
            //user kann keine projekte anlegen
            $('#createNewProj').hide();
            $('#createpro').html('Project Overview')

            //info - individuelle projektrenderung im projects!

             // darf projekte nicht editieren
            $('#ProjNews').html('you can see your news of the current Project here with the Pro version')
        }

//1. nur sein profil
$('.loggedinName').html(user.username);
