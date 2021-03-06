const express = require('express');
const recipeRoutes = express.Router();
var sha256 = require('js-sha256');

// Require Recipe model in our routes module
let Recipe = require('./recipe.model');
let Group = require('./group.model');
const userPsw = new Map();
userPsw.set('orsi','bbe7c9d4c4bc2326e3e6b9ee0bd7b555122ace1fa83bfee955e5c6305ee81844');
const tokens = new Map();
var TokenGenerator = require( 'token-generator' )({
        salt: 'recipedb',
		timestampMap: '1904192135'
    });

	
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
	if(req.body.token.localeCompare(tokens.get(req.body.user)) === 0){
		res.status(200).json({'valide': true});
	}else{
		res.status(401).json({'valide': false});
	}
  });


// Defined store route
recipeRoutes.route('/add').post(function (req, res) {
	if(!req.body.token.localeCompare(tokens.get(req.body.user)) === 0){
		res.status(401).send("auth error");
	}else{
  let recipe = new Recipe(req.body);
  console.log(req.body);
  recipe.save()
    .then((recipe) => {
		if(req.body.groupID === undefined){
			let group = new Group();
			group.recipes[0] = recipe._id.toString();
			group.save()
				.then((group)=> {
						recipe.groupID=group._id;
						recipe.save().then(rec => {
						  res.status(200).json('Update complete')
						  })
					  .catch(err => {
							res.status(400).send("unable to update the database")}
							)
					res.status(200).json({'recipe': 'recipe in added successfully'})})
				.catch(err => {
				res.status(400).send("unable to save to database");
				});
		}else{			
			 Group.findById( req.body.groupID, function(err, group) {
					if (!group){
					  res.status(404).send("data is not found");
					}
					else {
						group.recipes.push(
							recipe._id
						);
						console.log(group);
						group.save().then(rec => {
							
												
							
						
						  res.status(200).json('Update complete')
						  })
					  .catch(err => {
							res.status(400).send("unable to update the database")}
							)
					}
			 });
			
			
			
			
			
		
		}
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
	}
});

// Defined get data(index or listing) route
recipeRoutes.route('/').get(function (req, res) {

	if(!req.query.token.localeCompare(tokens.get(req.query.user)) === 0){
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
	if(!req.body.token.localeCompare(tokens.get(req.body.user)) === 0){
		res.status(401).send("auth error");
	}else{
  let id = req.params.id;
  Recipe.findById(id, function (err, recipe){
      res.json(recipe);
  });
	}
});

//  Defined update route
recipeRoutes.route('/update/:id').put(function (req, res) {

	if(!req.body.token.localeCompare(tokens.get(req.body.user)) === 0){
		res.status(401).send("auth error");
	}else{
    Recipe.findById(req.params.id, function(err, recipe) {
    if (!recipe){
      res.status(404).send("data is not found");
	}
    else {
		recipe.user =  req.body.user;
		recipe.date =  req.body.date;
		recipe.numberOfPeople =  req.body.numberOfPeople;
		recipe.tag =  req.body.tag;
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
        recipe.elokeszitesiIdo = req.body.elokeszitesiIdo;
		recipe.fileUrl = req.body.fileUrl;
		recipe.fileID = req.body.fileID;
        recipe.save().then(recipe => {
           res.status(200).json('Update complete')
      })
      .catch(err => {
		  console.log("ERR: " + err)
            res.status(400).send("unable to update the database");
      });
    }
	
  });
	}
});

// Defined delete | remove | destroy route
recipeRoutes.route('/delete/:id').get(function (req, res) {
	if(!req.body.token.localeCompare(tokens.get(req.body.user)) === 0){
		res.status(401).send("auth error");
	}else{
    Recipe.findByIdAndRemove({_id: req.params.id}, function(err, recipe){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
	}
});


// Search text
recipeRoutes.route('/recipes').get(function (req, res) {
	if(!req.query.token.localeCompare(tokens.get(req.query.user)) === 0){
		res.status(401).send("auth error");
	}else{
		let searchTexts = req.query.searchTexts;
		let textToSearch = "";
		console.log(searchTexts);
		searchTexts.forEach(function(tmp) {
		  textToSearch = textToSearch + " " + tmp;
		});
/*textToSearch=textToSearch.replace(/a/g, '[a,á,à,ä]')
            .replace(/e/g, '[e,é,ë]')
            .replace(/i/g, '[i,í,ï]')
            .replace(/o/g, '[o,ó,ö,ò]')
            .replace(/u/g, '[u,ü,ú,ù]');
			console.log(textToSearch);
			*/
		Recipe.find({
		  $text: { $search: textToSearch,
		   },
		})/*
		

		Recipe.
		find({
			"$or": [
				{ tag: { '$regex': textToSearch, '$options': 'i' } },
				{ user: { '$regex': textToSearch, '$options': 'i' } },
				{ receptCim: { '$regex': textToSearch, '$options': 'i' } },
			]
		})*/
		
		
		  .then(recipes => {console.log(recipes);  res.json(recipes);})
		  .catch(e => {console.error(e);
		  res.status(402).send("search error");});
		

	}
});


module.exports = recipeRoutes;