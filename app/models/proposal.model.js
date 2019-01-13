const mongoose = require('mongoose');
const ProposalSchema = mongoose.Schema({
    id:{ type: Number, ref: 'users.id' }, 
    matchId: { type: Number, ref: 'users.id' }, 
    status:  String,
    remarks :  String,
}, {
    timestamps: true
});
module.exports = mongoose.model('Proposal', ProposalSchema);