const User = require('../models/user.model.js');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var fs = require('fs');


// Create and Save an new User
exports.signup = (req, res) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Mail ID already exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        id: req.body.id,
                        name: req.body.name,
                        sex: req.body.sex,
                        email: req.body.email,
                        password: hash,
                        profileImage: req.file.filename,
                        status:req.body.status
                    });
                    user.save()
                        .then(data => {
                            // console.log(data);
                            res.status(201).json({
                                "Message": "User created"
                            });
                        }).catch(err => {
                            if (err.code == 11000) {
                                res.status(400).send({
                                    message: err.message || "Some error occurred while creating the Note."
                                });
                            } else {
                                console.log(err);
                                res.status(500).send({
                                    message: err.message || "Some error occurred while creating the Note."
                                });
                            }
                        });
                }
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};
// Check users authentication based on id and password.
exports.checkLogin = (req, res) => {

    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            return res.status(404).json({
                message: "Auth failed"
            });
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                } if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            id: user[0].id
                        },
                        "secret",
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token,
                        user: {
                            _id: user[0]._id,
                            id: user[0].id,
                            name: user[0].name,
                            sex: user[0].sex,
                            profileImage: 'http://localhost:9000/user/images/' + user[0].id + "/" + user[0].profileImage,
                            imageCount: user[0].images.length,
                            images: user[0].images.map(image => {
                                return {
                                    url: 'http://localhost:9000/user/images/' + user[0].id + "/" + image

                                }
                            })
                        }
                    });
                }
                return res.status(401).json({
                    message: "Auth failed"
                });
            });
        }
    }).catch()

    /*User.findOne({ id: req.body.id, password: req.body.password }).then(user => {
         if (!user) {
             return res.status(404).send({
                 message: "User not found with id " + req.body.id
             });
         } else {
             const result = {
                 status: "Authorised",
                 UserData: user
             }
             res.status(200).json(result);
         }
     }).catch(err => {
         console.log("err " + err.kind);
         if (err.kind === 'ObjectId') {
             return res.status(404).send({
                 message: "User not found with id " + req.body.id
             });
         }
         return res.status(500).send({
             message: "Error retrieving User with id " + req.body.id
         });
     });*/

};

// Retrieve and return all users from the database.
exports.getMatches = (req, res) => {
    // query for mobile req.query.sex
    //console.log(req.body);
    if (isEmpty(req.body.sex)) {
        return res.status(400).send({
            message: "Filter is not valid "
        });
    }
    var sexFilter;
    if (req.body.sex == "Male") {
        sexFilter = "Female";
    } else if (req.body.sex == "Female") {
        sexFilter = "Male";
    }
    console.log(sexFilter);
    User.find({ sex: sexFilter }).then(users => {
        if (!users) {
            return res.status(404).send({
                message: "No Users found for your query"
            });
        } else {
            const result = {
                count: users.length,
                UserData: users.map(user => {
                    return {
                        id: user.id,
                        name: user.name,
                        sex: user.sex,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:9000/userDetail/' + user.id
                        }
                    }
                })
            }
            res.status(200).json(result);

        }
    }).catch(err => {
        console.log("err " + err.kind);
        if (err.kind === 'ObjectId') {
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
exports.deleteUser = (req, res) => {
    console.log("Delte");
    console.log(req.params.id);
    if (isEmpty(req.params.id)) {
        return res.status(400).send({
            message: "Id is not valid "
        });
    }
    
    User.findOneAndUpdate({ id: req.params.id}, {status:"Deactivated"}, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.body.id
                });
            }
             res.status(200).json({
                 message:" User deactivated"
             });
           
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "User not found with id " + req.body.id
                });
            }
            return res.status(500).send({
                message: err.message || "Error updating note with id " + req.body.id
            });
        });

};

// Find a single user with a userid
exports.userDetail = (req, res) => {
    console.log(req.params.id);
    //console.log(req.query);

    if (isEmpty(req.params.id)) {
        return res.status(404).send({
            message: "Either Id is not valid "
        });
    }
    User.findOne({ id: req.params.id }).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.status(200).send(user);
    }).catch(err => {
        console.log("err " + err.kind);
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.params.id
        });
    });
};

// Update a user profile except the proposal, identified by the userid in the request
exports.updateUserProfile = (req, res) => {
    if (isEmpty(req.body.id)) {
        return res.status(400).send({
            message: "Id is not valid "
        });
    }
    var user = new User();
    user = req.body;
    User.findOneAndUpdate({ id: user.id }, user, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.body.id
                });
            }
            res.status(200).send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "User not found with id " + req.body.id
                });
            }
            return res.status(500).send({
                message: err.message || "Error updating note with id " + req.body.id
            });
        });


};


exports.uploadPic = (req, res) => {
  // console.log(req.files.length);
    var images = [];
    for (var i = 0; i < req.files.length; i++) {
        console.log(req.files[i].filename);
        images.push(req.files[i].filename);
    }


    User.findOneAndUpdate(
        { id: req.params.id },
        { $push: { images: images } },
        { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.body.id
                });
            }
            res.status(201).json({
                "Message": "Images uploaded",
                "Images":images
            });
        }).catch(err => {
            //console.log(err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "User not found with id " + req.body.id
                });
            }
            return res.status(500).send({
                message: err.message || "Error updating note with id " + req.body.id
            });
        });


};

exports.getPicture = (req, res) => {

    // Send default image if error
    var file = './user/images/' + req.params.id + '/' + req.params.pic;
    fs.stat(file, function (err, stat) {
        if (err) {
            return res.status(400).send({
                message: "Not valid path "
            });
        }
        var img = fs.readFileSync(file);
        res.contentType = 'image/jpeg';
        res.contentLength = stat.size;
        res.end(img, 'binary');
        return res.status(200).send();
    });



};

exports.getPictures = (req, res) => {
    console.log("getPictures");
    // Send default image if error
    var file = './user/images/' + req.params.id
    console.log("file path" + file);
    fs.stat(file, function (err, stat) {
        if (err) {
            return res.status(400).send({
                message: "Not valid path "
            });
        }
        var img = fs.readFileSync(file);
        res.contentType = 'image/jpeg';
        res.contentLength = stat.size;
        res.end(img, 'binary');
        return res.status(200).send();
    });



};

exports.deletePicture = (req, res) => {
    console.log(" Delete " + req.params.pic);
    // Send default image if error
    var file = './user/images/' + req.params.id + '/' + req.params.pic;
    User.findOneAndUpdate(
        { id: req.params.id },
        { $pull: { images: req.params.pic } },
        { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.body.id
                });
            }
            // delete file named 'sample.txt'
            fs.unlink(file, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
                res.status(200).json({
                    "Message": "Image deleted "+ req.params.pic
                });
            });
            
        }).catch(err => {
            //console.log(err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "User not found with id " + req.body.id
                });
            }
            return res.status(500).send({
                message: err.message || "Error updating note with id " + req.body.id
            });
        });


    /* fs.stat(file, function (err, stat) {
         if(err){
            return res.status(400).send({
                message: "Not valid path "
            });
         }
         var img = fs.readFileSync(file);
         res.contentType = 'image/jpeg';
         res.contentLength = stat.size;
         res.end(img, 'binary');
         return res.status(200).send();
     });*/



};
// Update a user's incoming & outgoing proposals identified by the userid in the request
/*exports.updateProposal = (req, res) => {

    // console.log("req.body.id"+ JSON.stringify(req.body));
    // console.log("req.body.id"+req.body.id);
    //console.log("req.body.incomingInterest(0).matchId "+ req.body.incomingInterest[0].matchId)

    if (isEmpty(req.body.id)) {
        return res.status(400).send({
            message: "Id is not valid "
        });
    }
    var user = new User();
    //user=req.body;
    User.updateOne({ id: req.body.id, 'incomingInterest.matchId': req.body.incomingInterest[0].matchId }, {
        '$set': {
            'incomingInterest.$.status': req.body.incomingInterest[0].status,
            'incomingInterest.$.remarks': req.body.incomingInterest[0].remarks
        }
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.body.id
                });
            }
            res.status(200).send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
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
exports.addProposal = (req, res) => {
    console.log("req.body.id" + req.body.id);
    console.log("req.body.incomingInterest.matchId " + req.body.outgoingInterest[0].matchId)

    var user = new User();
    user = req.body;
    if (isEmpty(user.id) || isEmpty(req.body.outgoingInterest[0].matchId)) {
        return res.status(400).send({
            message: "User Id or Match is not valid is not valid "
        });
    }

    var incomingreq = {
        "matchId": req.body.outgoingInterest[0].id,
        "status": req.body.outgoingInterest[0].status,
        "remarks": req.body.outgoingInterest[0].remarks
    }

    User.updateOne({ id: req.body.outgoingInterest[0].matchId }, { $push: { "incomingInterest": incomingreq } }, { "upsert": true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Match id " + req.body.outgoingInterest[0].matchId + " is not found"
                });
            }

            User.updateOne({ id: user.id }, { $push: { outgoingInterest: user.outgoingInterest[0] } }, { "upsert": true })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({
                            message: "User id " + req.body.id + " is not found"
                        });
                    }
                    res.status(200).send({
                        message: " Sent your request successfully"
                    });
                }).catch(err => {
                    console.log(" Error 2");
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: err.message || "User not found with id " + req.body.id
                        });
                    }
                    return res.status(500).send({

                        message: err.message || "Error while sending request " + req.body.id
                    });
                });

        }).catch(err => {
            console.log(" Error 1");
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "User not found with id " + req.body.id
                });
            }
            return res.status(500).send({

                message: err.message || "Error while sending request " + req.body.id
            });
        });


};

// Retrieve all proposals od the user
exports.getProsposals = (req, res) => {
    User.find({ id: req.body.id }, { "incomingInterest": 1 }, function (err, docs) {
        if (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: err.message || "User not found with id " + req.body.id
                });
            }
            return res.status(500).send({
                message: err.message || "Error while retreiving proposals with id " + req.body.id
            });
        }
        if (isArrayEmpty(docs)) {
            return res.status(404).send({
                message: "User Id " + req.body.id + " not found"
            });
        }
        var array = [];
        var inReq = [];

        inReq = docs[0].incomingInterest;
        if (!isArrayEmpty(inReq)) {
            console.log("not is empty");
            inReq.forEach(function (item) {
                array.push(item.matchId);
            });
        } else {
            console.log("is empty");
            return res.status(404).send({
                message: "No proposals found for the User Id " + req.body.id
            });
        }

        User.find({ id: { $in: array } }, function (err, docs) {
            return res.status(200).send(docs);
        });
    });
};*/

// Delete a user with the specified userid in the request
exports.delete = (req, res) => {
    //console.log("Delete "+req.query.id);
    User.findOneAndDelete({ id: req.query.id })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with id " + req.query.id
                });
            }
            res.status(200).send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.query.id
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.query.id
            });
        });
}

// Loin view page

exports.login = (req, res) => {
    res.render('../views/employee/create.ejs');
}


function isEmpty(value) {
    // console.log("is Empty");
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}
function isArrayEmpty(array) {
    if (array === undefined || array.length == 0) {
        return true;
    } else {
        return false;
    }
}
