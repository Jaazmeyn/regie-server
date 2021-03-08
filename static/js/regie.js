$('#saveProject').on('click', function(e){
    e.preventDefault();
    alert('works')
    console.log('newProject')

    let newProject = {
        newProjectTitle: $('#newProjectTitle').val(),
        
    }
    console.log(newProject)
    // $('#newProjModal').modal('hide')
})

// let contacts = {"crewMembers":[{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.33682613078290247","status":false},{"vorname":"dd","nachname":"isa","email":"email@lisa","password":"12345","number":"12345","id":"0.5783424493750503","status":false}]}
// console.log(contacts)

// let $tbBody = $('#v-pills-profile > .crewmemberlist > tbody > #crewmemberlist > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(2)')
// console.log($tbBody)
// $tbBody.css({'color':'red'})

// const renderContacts = () => {


// }