const mongoose = require('mongoose');
/*const UserSchema = mongoose.Schema({
    id: {type:Number,unique:true}, 
    name: String,
    sex:  String,
    password :  String,
    inbox: [
        { type: mongoose.Schema.ObjectId, ref: 'proposals' }
      ],
    sent: [
        { type: mongoose.Schema.ObjectId, ref: 'proposals' }
      ], 
}, {
    timestamps: true
});*/
const UserSchema = mongoose.Schema({
    id: {type:Number,unique:true}, 
    name: String,
    sex:  String,
    password :  String
    
}, {
    timestamps: true
});
module.exports = mongoose.model('User', UserSchema);