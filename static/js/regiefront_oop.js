class user{
    constructor(){
        this.Get();
        this.allTeammembers;
        this.MakeUsertable();
    }
    Get(){
        //JSON CREWFILE Push crewmembers in tr for each 
        $.ajax({ // projekt daten in den user unter projekte speichern
            url: 'regie/crewmemberlist',
            method: 'get',
            success:function(data){
                //let allTeammembers =  {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]};
                this.allTeammembers = data;
                this.MakeUsertable(this.allTeammembers);
            },
            error:function(){
                console.log('crewmemberlist XHR ERROR')
            }
        })//ende ajax -> user in tabelle
    }
    Edit(){ 
        $('.editUser').on('click', function(){
              let $clicked = $(this).parent()
             // $clicked.css({'background-color':'yellow'})
    
             // 1. bekomme geklicketen users aus html
             let clickedElement = $(this).parent().children().next(); console.log('clicked element',clickedElement )
             let editUserId = $(clickedElement).next().next().next().next().html(); console.log('edituserId',editUserId )
             // finde userid im json komme dadurch zu anderen eigenschaften des users bin ja schon im success
    
             //INHALT des geklicketen Users für modal
             let clickedUser = { 
                 editUserId : $(this).parent().children().next().next().next().next().next().html(),
                 clickedVN : clickedElement.html(),
                 clickedNN : $(clickedElement).next().html(),
                 clickedemail: clickedElement.next().next().html(),
                 clickednumber: clickedElement.next().next().next().html(),
             }
             //console.log('nname='+ clickedUser.clickedNN, clickedUser.clickedVN,'mail='+ clickedUser.clickedemail,'number='+  clickedUser.clickednumber)
             // let it = clickedUser.editUserId;
              console.log(allTeammembers.each(einzelner => { return this}))
              let thisUserId = einzelner.id; //userid: number
    
             // MODAL EDITUSER
             function changeModaltoEditModal(){//von addusermodal
                 $('#AddnewUserModal').modal('show');
                 //in den feldern steht der geklickte user drinnen
                 $('h3').html('Update Crewmember')
                 //INHALT des geklicken users in modal fügen
                 $(' #CrewmemberfirstnameInput').val(clickedUser.clickedVN)
                 $(' #CrewmemberlastnameInput').val(clickedUser.clickedNN)
                 $(' #CrewmemberemailInput').val(clickedUser.clickedemail)
                 $(' #CrewmembernumberInput').val(clickedUser.clickednumber)
                 $('#saveNewCrewMemberButton').html('save changes')
             } 
             changeModaltoEditModal();
            
             // ajax put 
             // Editierten User speichern
             $('#saveNewCrewMemberButton').on('click',  function(e){
                 e.preventDefault();
                 console.log('edit member')
    
                 // daten nach dem savechanges click aus modal auslesen
                 let Temmemberupdate = {
                     Id: einzelner.id,
                     newvn : $(' #CrewmemberfirstnameInput').val(),
                     newnn : $(' #CrewmemberlastnameInput').val(),
                     newmail : $(' #CrewmemberemailInput').val(),
                     newnumber : $(' #CrewmembernumberInput').val()
                 }
                 // user im modal unverändert
                 if(clickedUser.clickedVN == Temmemberupdate.newvn && clickedUser.clickedNN == Temmemberupdate.newnn && clickedUser.clickedemail == Temmemberupdate.newmail && clickedUser.clickednumber == Temmemberupdate.newnumber){
                     console.log('no changes');
                     $('#AddnewUserModal').modal('hide');
                     $clicked.css({'background-color':''})
                 } else { //user veraendert -> id und input mitschicken
                     $('#AddnewUserModal').modal('hide');
                     console.log('changes');
    
                     clickedElement.html(Temmemberupdate.newvn)
                     
                     $.ajax({ 
                         // url: 'regie/crewmemberlist/'+ Temmemberupdate.Id,
                         url: 'regie/crewmemberlist/:id',
                         method: 'put', 
                         data: JSON.stringify(Temmemberupdate),
                         contentType:'application/json',
                         success:function(req, res){
                             console.log(editUserId)
                             console.log(Temmemberupdate.Id,'!!!!!!')
                         },
                         error:function(){
                             console.log(editUserId, 'error')
                         }
                     })//ende ajax
                 }//ende else -> wenn user geändert
             })//ende save changes   
         })//ende edituser onclick
    }//ende edit user
    Del(){
        //// DELETE ////////
        $('.delUser').on('click', function(){
            let $clicked = $(this).parent();
            $clicked.hide();
            //INHALT
            let id = $(this).parent().children().next().next().next().next().next().html();
            $.ajax({
                url:'regie/crewmemberlist/:id',
                method: 'delete',
                data: JSON.stringify(id),
                contentType:'application/json',
                success:function(req, res){
                    //window.onloadstart();
                    //clickedElement.remove()
                    console.log('server erfolgreich')
                },
                error:function(){
                    console.log('delete XHR ERROR')
                }
            })
        })
    }//ende del user
    Add(){
        $('.addUser').on('click',  function(){
            $('#AddnewUserModal').modal('show');
            $('#CrewmemberfirstnameInput').val('');
            $('#CrewmemberlastnameInput').val('');
            $(' #CrewmemberemailInput').val('');
            $('h3').html('Add Crewmember');
            $('saveNewCrewMemberButton').html('save new Crewmember');
        
            //ajax post 
            $('#saveNewCrewMemberButton').on('click',  function(e){
                e.preventDefault();
                console.log('new member')
                $('#AddnewUserModal').modal('hide');
                let newTeamMember = {
                    vorname:$(' #CrewmemberfirstnameInput').val(),
                    nachname:$(' #CrewmemberlastnameInput').val(),
                    email:$(' #CrewmemberemailInput').val(),
                    password: null,
                    number:$(' #CrewmembernumberInput').val(),
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
    }
    MakeUsertable(){    
        let $tbBody = $('#memberoverview');
        this.allTeammembers.crewMembers.forEach(einzelner => {
            let $tr =  $('<tr>').appendTo($tbBody);
            //console.log(einzelner, 'einzelner');
                $('<td>').html('1').appendTo($tr)
                $('<td>').html(einzelner.vorname).appendTo($tr)
                $('<td>').html(einzelner.nachname).appendTo($tr)
                $('<td>').html(einzelner.email).appendTo($tr)
                $('<td>').html(einzelner.number).appendTo($tr)
                $('<td>').html(einzelner.id).appendTo($tr)
               
                ///// USERSTATUS für login
                if(einzelner.status == true){
                    $('<td>').append('<button>').attr({"class":"btn btn-primary editUser"}).html('edit').appendTo($tr);
                    $('<td>').append('<button>').attr({"class":"btn btn-danger delUser"}).html('delete').appendTo($tr);
         
                } else if(einzelner.status == false){
                    $('<td>').append('<button>').attr({"class":"btn btn-primary allowbtn"}).html('allow').appendTo($tr);
                    $('.allowbtn').on('click', function(){
                        let $clicked = $(this).parent();
                        $clicked.css({"background-color":"red"})
                        einzelner.status = true;
                        $(this).hide();
                        // html element variable $tr
                        // clicked 
                        let clickedTr = $clicked.children().$tr;
                        console.log(clickedTr)
                        $('<td>').append('<button>').attr({"class":"btn btn-primary editUser"}).html('edit').appendTo(clickedTr);
                        $('<td>').append('<button>').attr({"class":"btn btn-danger delUser"}).html('delete').appendTo(clickedTr);
                    })
                } else {
                        $('<td>').append('<button>').attr({"class":"btn btn-success userbestatigung"}).html('invited').appendTo($tr);
                }
            // for(let i in einzelner){
            //     $('<td>').html(einzelner[i][1]).appendTo($tr)
            // }
         })
         this.Edit();
         this.Del();
         this.Add();
    }
}
let member = new user();


  
