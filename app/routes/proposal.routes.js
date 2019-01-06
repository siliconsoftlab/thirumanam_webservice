module.exports = (app) => {
    const proposal = require('../controllers/proposal.controller.js');

    // Create a new Proposal
    app.post('/proposal', proposal.create);

    // Retrieve all Users
    app.post('/proposals', proposal.findAll);

    // Update an User with UserId
    app.put('/proposal', proposal.update);

    // Delete a Note with noteId
    app.delete('/proposal', proposal.delete);

    
    
}