const Proposal= require('../models/proposal.model.js');

// Retrieve all proposals for an  user
exports.findAll = (req, res) => {

    if(isEmpty(req.body.id) ){
        return res.status(400).send({
            message: "Filter is not valid "
        });
    }
   
    Proposal.find({$or:[{id:req.body.id},{matchId:req.body.id}]}).then(proposals=>{
        if(!proposals) {
            return res.status(404).send({
                message: "No Users found for your query"
            });            
        }
        res.status(200).send(proposals);
    }).catch(err=>{
        console.log("err "+err.kind);
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "No proposal found for your query"
            });                
        }
        return res.status(500).send({
            message: "Error while retrieving proposals "
        });
    });
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

// Update or creare proposal by the userid or match id 
exports.updateOrCreate = (req, res) => {
    if(isEmpty(req.body.id)){
        return res.status(400).send({
            message: "Id is not valid "
        });
    }
    var proposal = new Proposal();
    proposal=req.body;
    Proposal.up
    Proposal.updateOne({id:proposal.id}, proposal,{upsert: true, setDefaultsOnInsert: true},function(err, data){
       

        if(err){
            console.log(err);
           return res.status(400).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        }
       // console.log(data);
        return res.status(201).send(data);
        
    })
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
