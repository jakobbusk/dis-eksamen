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

router.get('/pictures/:eventid', function(req, res, next) {
  res.render('pictures', { title: 'Pictures' });
})


// Cron job
router.get('/cron', cronController.runCron);

// Send sms and email route
router.post('/api/sendNotification', NotifyController.sendNotification);

router.post('/api/upload/:eventid', upload.single("image"), PicturesController.uploadPicture);

router.get('/api/pictures/:eventid', PicturesController.getPictures);


module.exports = router;
