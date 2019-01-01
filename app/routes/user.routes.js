module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/user', users.create);

    // Login
    app.post('/login', users.login);

    // Retrieve all Users
    app.post('/users', users.findAll);

    // Retrieve a single User with UserId
    app.post('/userDetail', users.findOne);

    // Update an User with UserId
    app.put('/user', users.update);

    // Delete a Note with noteId
    app.delete('/deleteUser', users.delete);

    
    
}