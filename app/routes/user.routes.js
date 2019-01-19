module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    const multer  = require('multer')
    const checkAuth = require('../middleware/check-auth');
   //server.js
 
 
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  var upload = multer({ storage: storage })
      
  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
   console.log("--------- uploading file ------");
    const file = req.file
    if (!file) {
        console.log(" *****  no file");
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)
    
  })
    


  // Create a new User
   // app.post('/image', users.uploadImage);

    // Create a new User
    app.post('/user/signup', users.signup);

    // Login
    app.post('/user/login', users.login);

    // Retrieve all Users
    app.post('/users',checkAuth, users.getMatches);

    // Retrieve a single User with UserId
    app.get('/user/:id',checkAuth, users.userDetail);

    // Update an User profile with UserId
    app.put('/user',checkAuth, users.updateUserProfile);

     //Add proposal with UserId
    //app.post('/user/proposal', users.addProposal);
    
    //Update an User's proposals with UserId
    //app.put('/user/proposal', users.updateProposal);

        // get proposals for a UserId
     //app.post('/user/proposals', users.getProsposals);

    // Delete a Note with noteId
    app.delete('/deleteUser', users.delete); 
}