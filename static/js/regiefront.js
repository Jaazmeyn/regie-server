//save Projects in JSON send to bck
$('#saveNewProject').on('click', function(e){
    e.preventDefault();
    //alert('works')
    console.log('newProject')
    $('#newProjModal').modal('hide')
    let newProject = {
        newProjectTitle: $('#newProjectTitle').val(),
        newProjSyn: $('#newProjSynopsis').val(),
    }
    console.log(newProject)
    $.ajax({ // projekt daten in den user unter projekte speichern
        url: '/regie/newProject',
        method: 'post',
        data: JSON.stringify(newProject), //<- vom server in json gespeichert
        contentType:'application/json',
        success:( res ) => {
            console.log('projekt wurde zum Regisseuren gefügt')
        // projekt ins html fügen unter textarea
            //.append to newProjectdiv untereinander -> editable
            // (to profile myour projects .allproj ul li vom jsonfile)
            // function edit -> modal wieder öffnen -> ajax put
            // function delete -> ajax del
        // felder leeren
        $('#newProjectTitle').val(''),
        $('#newProjSynopsis').val('');
            
        },
        error:() => {
            console.log('XHR ERROR')
        }
    })
})

// let contacts = {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]}
// console.log(contacts)

 
//JSON CREWFILE Push crewmembers in tr for each 
$.ajax({ // projekt daten in den user unter projekte speichern
    url: 'regie/crewmemberlist',
    method: 'get',
    success:function(data){
            //let allTeammembers =  {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]};
            let allTeammembers = data;

            let $tbBody = $('#memberoverview');

            allTeammembers.crewMembers.forEach(einzelner => {
                let $tr =  $('<tr>').appendTo($tbBody);
                console.log(einzelner.name, 'einzelner');

                for(let i in einzelner){
                    $('<td>').html(einzelner[i]).appendTo($tr)
                }
            //     $('<td>').append($('<button>').html('edit').className('btn btn-primary edit')).appendTo($tr),
            //     $('<td>').append($('<button>').html('delete').className('btn btn-primary delete')).appendTo($tr)
             })
    },
    error:function(){
        console.log('crewmemberlis XHR ERROR')

    }
})//ende ajax
    

