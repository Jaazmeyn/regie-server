$.ajax({
    method: "GET",
    url: "profile.js",
    dataType: "script"
});


$('#bilduploader').on('submit', function(e){
    e.preventDefault();
    $.ajax({
        url:'http://localhost:5001/upload',
        data:FormData,//file
        processData:false,
        contentType:false,
        success:function(res){
            console.log('success')
            // bildpfad als src des profilbildes
            $('#profilbild').attr({'src':res})
        },
        error:function(){
            console.log('profilbildupload XHR')
        }
    });
})