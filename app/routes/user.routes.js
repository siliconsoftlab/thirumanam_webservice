module.exports = (app) => {
  const users = require('../controllers/user.controller.js');
  const multer = require('multer')
  const checkAuth = require('../middleware/check-auth');
  //server.js
  var fs = require('fs');

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = './user/images/' + req.body.id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir)

    },
    filename: function (req, file, cb) {
      if (file.mimetype === 'image/png') {
        cb(null, req.body.id + "_" + "profilepic.png");
      } else if (file.mimetype === 'image/jpeg') {
        cb(null, req.body.id + "_" + "profilepic.jpeg");
      }

    }
  });


  var storageMorepic = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = './user/images/' + req.params.id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir)

    },
    filename: function (req, res, cb) {
     // console.log("1 " + req.params.id);
     // console.log("2  " + req.files.length);
      //console.log("3  " + JSON.stringify(res));
     // console.log("4 " + req.params.count);
      var count=req.params.count;
      var len=req.files.length;
      var sno=Number(count)+Number(len);
      //console.log("SNO "+sno);
      if (res.mimetype === 'image/png') {
        cb(null, req.params.id + "_"+sno+"_morepic.png");
      }else if (res.mimetype === 'image/jpeg') {
        cb(null, req.params.id + "_"+sno+"_morepic.jpeg");
      }
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('I don\'t have a clue!'), false);
    }

  };
  var upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter: fileFilter
  });


  var uploadMorePic = multer({
    storage: storageMorepic,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
  });
  // Create a new User
  app.post('/user/signup', upload.single('profileImage'), users.signup);

  // Login
  app.post('/user/login', users.checkLogin);

  // Retrieve all Users
  app.post('/users', checkAuth, users.getMatches);

  // Retrieve a single User with UserId
  app.get('/user/:id', checkAuth, users.userDetail);

 // Retrieve a single User with UserId
 app.delete('/user/:id', checkAuth, users.deleteUser);

  // Update an User profile with UserId
  app.put('/user', checkAuth, users.updateUserProfile);

  // Update an User profile with UserId
  app.put('/user/:id/upload/:count', checkAuth, uploadMorePic.array('photos', 5), users.uploadPic);
 
  app.get('/user/images/:id/:pic', checkAuth,users.getPicture);
  app.get('/user/images/:id', checkAuth,users.getPictures);

  app.delete('/user/images/:id/:pic',checkAuth,users.deletePicture);
  //Add proposal with UserId
  //app.post('/user/proposal', users.addProposal);

  //Update an User's proposals with UserId
  //app.put('/user/proposal', users.updateProposal);

  // get proposals for a UserId
  //app.post('/user/proposals', users.getProsposals);

  // Delete a Note with noteId
  app.delete('/deleteUser', users.delete);

  //view for login

  app.get('/create', users.login);
}