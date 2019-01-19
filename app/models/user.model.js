const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {type:Number,unique:true, required: true}, 
    name: String,
    email: {type:String,unique:true, required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }, 
    sex:  String,
    password : String,
    
}, {
    timestamps: true
});
module.exports = mongoose.model('User', UserSchema);