const mongoose = require('mongoose');
const ProposalSchema = mongoose.Schema({
    id:Number, 
    matchId: Number,
    status:  String,
    remarks :  String,
}, {
    timestamps: true
});
module.exports = mongoose.model('Proposal', ProposalSchema);