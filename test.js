require('dotenv').config();
const pinController = require('./controller/pinController');

pinController.createPin('test@test.dk', 'test', '123456').then(res => {
    console.log('Pin created:', res);
}).catch(err => {
    console.error('Error creating pin:', err);
});