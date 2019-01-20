const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {type:Number,unique:true, required: true}, 
    name:{type:String,required: true}, 
    email: {type:String,unique:true, required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }, 
    sex:  {type:String, required: true}, 
    password : {type:String,required: true}, 
    profileImage: {type:String, required: true}, 
    images:[{type:String}],
    status:{type:String,required: true}
    
}, {
    timestamps: true
});
module.exports = mongoose.model('User', UserSchema);