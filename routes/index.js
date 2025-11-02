var express = require('express');

var router = express.Router();
var cronController = require('../controller/cronController');
const NotifyController = require('../controller/notifyController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Cron job
router.get('/cron', cronController.runCron);

// Send sms and email route
router.post('/sendNotification', NotifyController.sendNotification);


module.exports = router;
