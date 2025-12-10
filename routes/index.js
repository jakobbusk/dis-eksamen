var express = require('express');
const dotenv = require('dotenv');
dotenv.config();
var router = express.Router();
var cronController = require('../controller/cronController');
const NotifyController = require('../controller/notifyController');
const PicturesController =  require('../controller/picturesController');
const os = require('os');
const pin = require('../controller/pinController');


const multer = require("multer");

// Link: https://www.npmjs.com/package/multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', eventid: '' });
});
//med forudfyldt eventId
router.get('/prefill/:eventid?', function(req, res, next) {
  res.render('index', { title: 'Express', eventid: req.params.eventid });
});

router.get('/pictures/:eventid', pin.authorizePin, function(req, res, next) {
  res.render('pictures', { title: 'Pictures' });
})

router.get('/upload/:eventid', pin.authorizePin, function(req, res, next) {
  res.render('upload', { title: 'Upload Picture' });
});

//login
router.post('/api/login', pin.login);


router.post('/api/upload/:eventid', pin.authorizePin, upload.single("image"), PicturesController.uploadPicture);

router.get('/api/pictures/:eventid', pin.authorizePin, PicturesController.getPictures);

// Whoami route
router.get('/api/whoami', function(req, res, next) {
  return res.status(200).send(os.hostname());
});

module.exports = router;
