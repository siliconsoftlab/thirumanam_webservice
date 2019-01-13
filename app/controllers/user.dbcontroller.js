const User= require('../models/user.model.js');

// Create and Save an new User
 function registerUser(req, res){
    console.log("create");
    console.log("req.body.password "+req.body.password);
    console.log("req.body.id "+req.body.id);
    var id=req.body.id;
    var password=req.body.password;
    // Validate request
    if(isEmpty(req.body.id) || isEmpty(req.body.name) || isEmpty(req.body.sex) || isEmpty(req.body.password)){
        return res.status(400).send({
            message: "One or more user data is not valid "
        });
    }
  
   
    // Create a User
    const user = new User({
        id: req.body.id,
        name: req.body.name,
        sex: req.body.sex,
        password : req.body.password

    });

    // Save User in the database
    
    user.save()
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
 }

// Check users authentication based on id and password.
function login(req, res){
    console.log(req.body.id);
    console.log(req.body.password);
        if(isEmpty(req.body.id) || isEmpty(req.body.password)){
            return res.status(400).send({
                message: "Either Id or Password is not valid "
            });
        }
        User.findOne({id:req.body.id,password:req.body.password}).then(user=>{
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " +req.body.id
                });            
            }
            res.status(200).send(user);
        }).catch(err=>{
            console.log("err "+err.kind);
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " +req.body.id
                });                
            }
            return res.status(500).send({
                message: "Error retrieving User with id " +req.body.id
            });
        });
}

// Retrieve and return all users from the database.
function findAll (req, res) {
    
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

// Find a single user with a userid
function findOne (req, res){
    if(isEmpty(req.query.id)){
        return res.status(404).send({
            message: "Either Id is not valid "
        });
    }
    User.findOne({id:req.query.id}).then(user=>{
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " +req.query.id
            });            
        }
        res.status(200).send(user);
    }).catch(err=>{
        console.log("err "+err.kind);
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " +req.body.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with id " +req.body.id
        });
    });
};

// Update a user profile identified by the userid in the request
function update (req, res) {
    if(isEmpty(req.body.id)){
        return res.status(400).send({
            message: "Id is not valid "
        });
    }
    var user = new User();
    user=req.body;
    User.findOneAndUpdate({id:user.id}, user, {new: true})
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

// Update a use's incoming & outgoing proposals identified by the userid in the request
function updateProposal(req, res) {

   // console.log("req.body.id"+ JSON.stringify(req.body));
    console.log("req.body.id"+req.body.id);
   console.log("req.body.incomingInterest.matchId "+req.body.incomingInterest)
    if(isEmpty(req.body.id)){
        return res.status(400).send({
            message: "Id is not valid "
        });
    }
    var user = new User();
    user=req.body;
    User.updateOne({id:user.id,'incomingInterest.matchId':18}, {'$set': {
        'incomingInterest.$.status': '!!!!!!',
        'incomingInterest.$.remarks': '####'
    }}, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " +req.body.id
            });
        }
        console.log("!!!!!!");
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


// Update a use's incoming & outgoing proposals identified by the userid in the request
function addProposal (req, res) {

    // console.log("req.body.id"+ JSON.stringify(req.body));
     console.log("req.body.id"+req.body.id);
    console.log("req.body.incomingInterest.matchId "+req.body.incomingInterest)
     if(isEmpty(req.body.id)){
         return res.status(400).send({
             message: "Id is not valid "
         });
     }
     var user = new User();
     user=req.body;
     User.updateOne({id:user.id,'incomingInterest.matchId':18}, {$push: { incomingInterest: {id:10}}} , {new: true})
     .then(user => {
         if(!user) {
             return res.status(404).send({
                 message: "User not found with id " +req.body.id
             });
         }
         console.log("!!!!!!");
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
 

// Delete a user with the specified userid in the request
function delte(req, res){
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
