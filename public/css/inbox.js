$(document).ready(function(){
    var session;
    var messageid;
    $.post('/inbox',function(data){
        session = data.session;
        for(var i=0;i<data.messages.length;i++){
            $('tbody').append('<tr>'+
                '<td>'+data.messages[i].senderEmail+'</td>'+

            '<td>'+data.messages[i].recieverEmail+'</td>'+

            '<td><a href="#messageinbox" id="'+data.messages[i]._id+'" role="button" class="btn" data-toggle="modal">View</a></td>'+
            '</tr>');

        }
        $('tbody > tr > td > a').click(function(){
            messageid = $(this).attr('id');

            var data = {
                id:messageid
            };
            $.post('/fetch',data,function(res){
                $('#list').html('');
                for(var i=0;i<res.message.thread.length;i++){
                    if(session == res.message.thread[i].senderID){
                        $('#list').append('<div class="text-right"><h5>: Me</h5><p>'+res.message.thread[i].message+'</p></div>');
                    }else{
                        $('#list').append('<div class="text-left"><p>'+res.message.thread[i].message+'</p></div>');
                    }

                }
            });
        });
    });
    $('#reply').click(function(){
        var d = new Date();

        var newThread = {
            msg : $('#replyMsg').val(),
            threadid : messageid,
            time:d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "  " + d.getDay() + "-" + d.getMonth() + "-" + d.getFullYear()

    }
        $.post('/reply',newThread,function(res){
            $('#list').append('<div class="text-right"><h5>: Me</h5><p>'+res+'</p></div>');
            $('#replyMsg').val('');
        });
    });
});