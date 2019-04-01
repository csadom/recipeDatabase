const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8000;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
const recipeRoute = require('./recipe.route');

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var server_port = process.env.OPENSHIFT_NODEJS_PORT || PORT;

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/recipe', recipeRoute);

app.listen(server_port, , server_ip_address, function(){
  console.log('Server is running on Port:',server_port);
});