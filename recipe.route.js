const express = require('express');
const recipeRoutes = express.Router();
var sha256 = require('js-sha256');

// Require Recipe model in our routes module
let Recipe = require('./recipe.model');
const userPsw = new Map();
userPsw.set('orsi','bbe7c9d4c4bc2326e3e6b9ee0bd7b555122ace1fa83bfee955e5c6305ee81844');
const tokens = new Map();
var TokenGenerator = require( 'token-generator' )({
        salt: 'recipedb',
		timestampMap: '1904192135'
    });
	
var isValidToken = function (user, token) {
	if(token.localeCompare(tokens.get(user)) === 0){
		return true;
	}else{
		return false;
	}
	};
	
// Login
recipeRoutes.route('/login').post(function (req, res) {
	if(sha256(req.body.psw).localeCompare(userPsw.get(req.body.user)) === 0){
		var token = TokenGenerator.generate();
		tokens.set(req.body.user,token);
		res.status(200).json({'token': token});
	}else{
		res.status(401).json({'error': 'wrong user or psw'});
	}
  });
  
//Validate token
recipeRoutes.route('/token').post(function (req, res) {
	if(isValidToken(token,tokens.get(req.body.user))){
		res.status(200).json({'valide': true});
	}else{
		res.status(401).json({'valide': false});
	}
  });


// Defined store route
recipeRoutes.route('/add').post(function (req, res) {
	if(isValidToken){
		res.status(401).send("auth error");
	}else{
  let recipe = new Recipe(req.body);
  recipe.save()
    .then(recipe => {
      res.status(200).json({'recipe': 'recipe in added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
	}
});

// Defined get data(index or listing) route
recipeRoutes.route('/').get(function (req, res) {
	if(isValidToken){
		res.status(401).send("auth error");
	}else{
    Recipe.find(function(err, recipes){
    if(err){
      console.log(err);
    }
    else {
      res.json(recipes);
    }
	
  });
	}
});

// Defined edit route
recipeRoutes.route('/edit/:id').get(function (req, res) {
	if(isValidToken){
		res.status(401).send("auth error");
	}else{
  let id = req.params.id;
  Recipe.findById(id, function (err, recipe){
      res.json(recipe);
  });
	}
});

//  Defined update route
recipeRoutes.route('/update/:id').post(function (req, res) {
	if(isValidToken){
		res.status(401).send("auth error");
	}else{
    Recipe.findById(req.params.id, function(err, recipe) {
    if (!recipe)
      res.status(404).send("data is not found");
    else {
        recipe.receptCim = req.body.receptCim;
        recipe.elkeszitesiIdo = req.body.elkeszitesiIdo;
        recipe.kaloria = req.body.kaloria;
        recipe.evszak = req.body.evszak;
        recipe.unnep = req.body.unnep;
        recipe.dieta = req.body.dieta;
        recipe.menu = req.body.menu;
        recipe.napszak = req.body.napszak;
        recipe.technika = req.body.technika;
        recipe.hozzavalok = req.body.hozzavalok;
        recipe.elkeszites = req.body.elkeszites;
		recipe.fileUrl = req.body.fileUrl;
		recipe.fileID = req.body.fileID;

        recipe.save().then(recipe => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
	
  });
	}
});

// Defined delete | remove | destroy route
recipeRoutes.route('/delete/:id').get(function (req, res) {
    Recipe.findByIdAndRemove({_id: req.params.id}, function(err, recipe){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = recipeRoutes;