const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    id: {type:Number,unique:true}, 
    name: String,
    sex:  String,
    password :  String,
    incomingInterest: [
        {matchId:Number,
        status:String,
        remarks:String}
    ],
    outgoingInterest: [
        {matchId:Number,
        status:String,
        remarks:String}
    ]
}, {
    timestamps: true
});
module.exports = mongoose.model('User', UserSchema);