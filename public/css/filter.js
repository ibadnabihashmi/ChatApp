$(document).ready(function(){
    var reciever_id;
    var message;
    var users ;
    var time;
    var email_rec;
    $.post('/filter',function(data){

        $('#users').html('');
        for(var i=0;i<data.users.length;i++){
            $('#users').append('<tr>'+
                                '<td id="email'+data.users[i]._id+'">'+
                                    data.users[i].email+
                                '</td>'+
                                '<td>'+
                                    '<a href="#messageBox" id="'+data.users[i]._id+'" role="button" class="btn" data-toggle="modal">Let\'s Chat</a>'+
                                '</td>'+
                                '</tr>');
            $('tbody > tr > td > a').click(function(){
                var d = new Date();
                    reciever_id= $(this).attr('id');
                    email_rec = $('#email'+reciever_id).html();
            });
        }
    });
    $('#send').click(function(){
        message= $('#mess').val();
        var d = new Date();
        time=d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "  " + d.getDay() + "-" + d.getMonth() + "-" + d.getFullYear();
        var thread = {
            rid:reciever_id,
            msg:message,
            time:time,
            emailRec:email_rec
        };
        $.post('/send',thread,function(res){
            alert(res);
        });
    });

});