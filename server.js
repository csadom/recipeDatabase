const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
const recipeRoute = require('./recipe.route');

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '0.0.0.0';

app.use(bodyParser());
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.get('/', function (req, res) {
    res.status('200').send('Service is up');
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json());

app.use('/recipe', recipeRoute);

app.listen(port, ip, function(){
  console.log('Server is running on Port:',PORT);
});