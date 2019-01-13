const Proposal= require('../models/proposal.model.js');
const User= require('../models/user.model.js');

// Update or creare proposal by the userid or match id 
exports.updateOrCreate = (req, res) => {
    //console.log('updateOrCreate');
    if(isEmpty(req.body.id) ||isEmpty(req.body.matchId) ){
        return res.status(400).send({
            message: "Id or Match Id is not valid "
        });
    }
    var proposal = new Proposal();
    proposal=req.body;
  //console.log("Proposal "+ JSON.stringify(proposal));
    Proposal.updateOne({id:proposal.id,matchId:proposal.matchId}, proposal,{upsert: true, setDefaultsOnInsert: true},function(err, data){
        if(err){
        console.log(err);
           return res.status(400).send({
                message: err.message || "Some error occurred while creating the proposal"
            });
        }
        return res.status(201).send(data);
    })
};

// Retrieve outgoing ptoposals for an  user
exports.findOutgoingProposals = (req, res) => {
    if(isEmpty(req.body.id)){
        return res.status(400).send({
            message: "Id is not valid "+ req.body.id
        });
    }
   
 Proposal.aggregate([
    { $match: { id:req.body.id} } ,
        {$lookup: {
          from: "users", 
          localField: "matchId",
          foreignField: "id",
          as: "user_info"}
        }
      ]).exec().then(function(data){
        //console.log(data)
        res.status(200).send(data);
        }).catch(function(err){
            console.log(err);
            return res.status(400).send({
                 message: err.message || "Some error occurred while retreiving the proposal"
             });
        }); 
};


// Retrieve incoming ptoposals for an  user
exports.findIncomingProposals = (req, res) => {
    if(isEmpty(req.body.id)){
        return res.status(400).send({
            message: "Id or MatchId is not valid "
        });
    }
   

 Proposal.aggregate([
    { $match: { matchId:req.body.id } } ,
        {$lookup: {
          from: "users", 
          localField: "id",
          foreignField: "id",
          as: "user_info"}
        }
      ]).exec().then(function(data){
       // console.log(data)
        res.status(200).send(data);
        }).catch(function(err){
            console.log(err);
            return res.status(400).send({
                message: err.message || "Some error occurred while retreiving the proposal"
            });
        })
};

// Update a proposal by the userid or match id 
exports.update = (req, res) => {
    if(isEmpty(req.body.id)){
        return res.status(400).send({
            message: "Id is not valid "
        });
    }
    var proposal = new Proposal();
    proposal=req.body;
    Proposal.findOneAndUpdate({id:proposal.id}, proposal, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " +req.body.id
            });
        }
        res.status(200).send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: err.message || "User not found with id " + req.body.id
            });                
        }
        return res.status(500).send({
            message: err.message || "Error updating note with id " + req.body.id
        });
    });

    
};



// Delete a proposal userid in the request
exports.delete = (req, res) => {
   //console.log("Delete "+req.query.id);
    User.findOneAndDelete({id:req.query.id})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Note not found with id " + req.query.id
            });
        } 
        res.status(200).send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.query.id
            });                
        } 
        return res.status(500).send({
            message: "Could not delete user with id " + req.query.id
        });
    });
}


function isEmpty(value) {
   // console.log("is Empty");
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
  }
