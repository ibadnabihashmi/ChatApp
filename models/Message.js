var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    sender : mongoose.Schema.Types.ObjectId ,
    reciever : mongoose.Schema.Types.ObjectId ,
    senderEmail:{type : String , default : ''},
    recieverEmail:{type : String , default : ''},
    thread : [{
        senderID : mongoose.Schema.Types.ObjectId ,
        recieverID : mongoose.Schema.Types.ObjectId ,
        message : {type : String , default : ''},
        time :{type : String , default : ''}
    }]
},{
    collection : 'message'
});
module.exports = mongoose.model('Message', messageSchema);