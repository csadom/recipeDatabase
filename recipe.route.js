const express = require('express');
const recipeRoutes = express.Router();

// Require Recipe model in our routes module
let Recipe = require('./recipe.model');

// Defined store route
recipeRoutes.route('/add').post(function (req, res) {
  let recipe = new Recipe(req.body);
  recipe.save()
    .then(recipe => {
      res.status(200).json({'recipe': 'recipe in added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
recipeRoutes.route('/').get(function (req, res) {
    Recipe.find(function(err, recipes){
    if(err){
      console.log(err);
    }
    else {
      res.json(recipes);
    }
  });
});

// Defined edit route
recipeRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Recipe.findById(id, function (err, recipe){
      res.json(recipe);
  });
});

//  Defined update route
recipeRoutes.route('/update/:id').post(function (req, res) {
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
});

// Defined delete | remove | destroy route
recipeRoutes.route('/delete/:id').get(function (req, res) {
    Recipe.findByIdAndRemove({_id: req.params.id}, function(err, recipe){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = recipeRoutes;