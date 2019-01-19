module.exports = (app) => {
    const proposal = require('../controllers/proposal.controller.js');
    const checkAuth = require('../middleware/check-auth');
  
    // Create or Update Update  an User with UserId
    app.post('/user/proposal',checkAuth, proposal.updateOrCreate);
    
    // Retrieve all Users
    app.post('/user/sent',checkAuth, proposal.findOutgoingProposals);

    // Retrieve all Users
    app.post('/user/inbox',checkAuth, proposal.findIncomingProposals);

    
    /*
    app.put('/proposal', proposal.update);
    app.delete('/proposal', proposal.delete);*/

    
    
}