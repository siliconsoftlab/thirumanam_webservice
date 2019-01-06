const Proposal= require('../models/proposal.model.js');

// Create a new proposal
exports.create = (req, res) => {
    if(isEmpty(req.body.id) || isEmpty(req.body.matchId) || isEmpty(req.body.status) || isEmpty(req.body.remarks)){
        return res.status(400).send({
            message: "One or more proposal data is not valid "
        });
    }
  
   
    // Create a proposal
   

    const proposal = new Proposal({
        id: req.body.id,
        matchId: req.body.matchId,
        status: req.body.status,
        remarks : req.body.remarks

    });
    

    // Save User in the database
    
    proposal.save()
    .then(data => {
        res.status(201).send(data);
    }).catch(err => {
        if(err.code==11000){
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        }else{
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
        }
    });
};


// Retrieve all proposals for an  user
exports.findAll = (req, res) => {

    if(isEmpty(req.query.sex)){
        return res.status(400).send({
            message: "Filter is not valid "
        });
    }
    var sexFilter;
    if (req.query.sex=="Male"){
     sexFilter="Female";
    }else if(req.query.sex=="Female"){
        sexFilter="Male";
    }
    User.find({sex:sexFilter}).then(users=>{
        if(!users) {
            return res.status(404).send({
                message: "No Users found for your query"
            });            
        }
        res.status(200).send(users);
    }).catch(err=>{
        console.log("err "+err.kind);
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "No Users found for your query"
            });                
        }
        return res.status(500).send({
            message: "Error while retrieving Users "
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
    Proposal.up
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
