var express = require('express');
const dotenv = require('dotenv');
dotenv.config();
var router = express.Router();
var cronController = require('../controller/cronController');
const NotifyController = require('../controller/notifyController');
const PicturesController =  require('../controller/picturesController');


const multer = require("multer");

// Link: https://www.npmjs.com/package/multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Cron job
router.get('/cron', cronController.runCron);

// Send sms and email route
router.post('/sendNotification', NotifyController.sendNotification);

router.post('/upload/:eventid', upload.single("image"), PicturesController.uploadPicture);

router.get('/pictures/:eventid', PicturesController.getPictures);


module.exports = router;
