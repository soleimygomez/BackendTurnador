const express = require('express');
const morgan = require('morgan'); 
const app = express();
const RoutesApi = require("./src/routes/index")
const fs = require('fs'); 
var https = require('https');
var pem = require('pem') ; 
app.set('port',  process.env.PORT ||  4003);
//app.use(express.static(__dirname + '../files'));
app.use(express.json());
app.use(morgan('dev'));
var cors = require('cors');
app.use(cors());
app.options('*', cors())
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token,  X-Requested-With, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

    next();
});
 
// pem.createCertificate({ days: 1, selfSigned: true }, function (keys) {
   
//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
//     app.get('/', function (req, res) {
//       res.send('o hai!')
//     })
   
// })
RoutesApi(app);
//Server
app.listen(app.get('port'), () => {
    console.log('Server in port: 4003');
});


module.exports = app
