module.exports = (app) => {
    const proposal = require('../controllers/proposal.controller.js');

  
    // Create or Update Update  an User with UserId
    app.post('/proposal', proposal.updateOrCreate);
    
    // Retrieve all Users
    app.post('/proposals/sent', proposal.findOutgoingProposals);

    // Retrieve all Users
    app.post('/proposals/inbox', proposal.findIncomingProposals);

    
    // Update an User with UserId
    app.put('/proposal', proposal.update);

    
    
    // Delete a Note with noteId
    app.delete('/proposal', proposal.delete);

    
    
}