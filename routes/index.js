var express = require('express');
var router = express.Router();

let serverArray = [];

let RecipeObject = function(pCategory, pName, pTime, pIngredients, pInstructions) {
    this.ID = Math.random().toString(16).slice(5);
    this.category = pCategory;
    this.name = pName;
    this.time = pTime;
    this.ingredients = pIngredients;
    this.instructions = pInstructions;
}

// 3 Example Recipes
serverArray.push(new RecipeObject("Breakfast", "Cereal", "3 min", "Cereal and Milk", "Pour cereal into a bowl followed by milk"));
serverArray.push(new RecipeObject("Lunch", "Rice w/ egg", "10 min", "Rice, Egg(s), Soy Sauce", "Cook rice, fry egg(s), pour soy sauce on top"));
serverArray.push(new RecipeObject("Breakfast", "PB&J", "5 min", "Bread, Peanut Butter, Jelly", "Spread peanut butter on one side of both pieces of bread, spread jelly on top of the peanut butter, put the bread together w pb&j facing inwards"));

console.log(serverArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all recipe data */
router.get('/getAllRecipes', function(req, res) {
  res.status(200).json(serverArray);
});

/* Add one new Recipe */
router.post('/addRecipe', function(req, res) {
  const newRecipe = req.body;
  serverArray.push(newRecipe);
  res.status(200).json(newRecipe);
});

module.exports = router;
