var User = require('../models/User');
var Message = require('../models/Message');
var secrets = require('../config/secrets');


//*** the following code list all the registered users


exports.getFilter = function(req,res){
    res.render('filter', {
        title: 'Filter Users'
    });
}



exports.filter = function(req,res){

    User.find({},function(err,users){
        if(users){

            res.send(200,{
                users:users
            });
        }else{
            res.status(400).send('nothing found');
        }
    });
};


//******sends the message to the user from the fetched list

exports.send = function(req,res){
    Message.find({ $or: [{$and:[{sender:req.body.rid},{reciever:req.user.id}]},{$and:[{sender:req.user.id},{reciever:req.body.rid}]}] },function(err,msg){
        if(msg.length > 0){
            //        console.log(msg[0].thread);
            msg[0].thread.push({
                senderID : req.user.id,
                recieverID : req.body.rid,
                message : req.body.msg,
                time : req.body.time
            });
            msg[0].save(function(err){
                if(!err){
                    console.log("ok");
                    res.send(200);
                }
            });
        }else{
             User.findById(req.user.id,function(err,user){
                 if(user){
                     var newMessage;
                     newMessage = new Message;
                     newMessage.sender = req.user.id;
                     newMessage.reciever = req.body.rid;
                     newMessage.senderEmail = user.email;
                     newMessage.recieverEmail = req.body.emailRec;
                     newMessage.thread.push({
                         senderID : req.user.id,
                         recieverID : req.body.rid,
                         message : req.body.msg,
                         time : req.body.time
                     });
                     newMessage.save(function(err){
                         if(!err){
                             console.log("ok");
                             res.send(200);
                         }
                     });

                 }else{
                     console.log('nothing found');
                     res.status(400).send('nothing found')
                 }
             });

        }
    });

};

//**** render inbox


exports.getinbox = function(req,res){
    res.render('inbox',{
        title:'Inbox'
    });
};

//*** fetch only those messages in which the requested user is associated

exports.postinbox = function(req,res){
    console.log(req.user.id);
    User.findById(req.user.id,function(err,user){
        if(user){
            Message.find({$or:[{sender:req.user.id},{reciever:req.user.id}]},function(err,data){
                if(data){
                    res.send(200,{
                        session:req.user.id,
                        messages:data
                    });
                }else{
                    res.status(400).send('nothingFound');
                }
            });
        }
    });
    Message.find({},function(err,data){

    });
};

//***fetch the thread to display in the modal

exports.fetchThread = function(req,res){

    Message.findById(req.body.id,function(err,thread){
        if(thread){
            res.send(200,{
                message:thread
            });
        }else{
            res.status(400).send('nothingFound');
        }
    });
};

//**** middle ware to reply

exports.reply = function(req,res){
    var rec;
    var send;
    Message.findById(req.body.threadid,function(err,msg){
        if(msg){
            if(req.user.id == msg.sender){
                send = msg.sender;
                rec = msg.reciever;
            }else if(req.user.id == msg.reciever){
                rec = msg.sender;
                send = msg.reciever;
            }

                msg.thread.push({
                    senderID : send,
                    recieverID : rec,
                    message : req.body.msg,
                    time : req.body.time
                });
                msg.save(function(err){
                    if(!err){
                        console.log("Old message sent"+msg);
                        res.send(msg.thread[msg.thread.length-1].message);
                    }
                });

        }else{
            res.status(400).send('nothingFound');
        }
    });
}