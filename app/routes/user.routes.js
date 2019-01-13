module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/user', users.register);

    // Login
    app.post('/login', users.login);

    // Retrieve all Users
    app.post('/users', users.getMatches);

    // Retrieve a single User with UserId
    app.post('/userDetail', users.getMatchDetail);

    // Update an User profile with UserId
    app.put('/user', users.updateUserProfile);

     //Add proposal with UserId
    //app.post('/user/proposal', users.addProposal);
    
    //Update an User's proposals with UserId
    //app.put('/user/proposal', users.updateProposal);

        // get proposals for a UserId
     //app.post('/user/proposals', users.getProsposals);

    // Delete a Note with noteId
    app.delete('/deleteUser', users.delete); 
}