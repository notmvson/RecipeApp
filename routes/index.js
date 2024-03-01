var express = require('express');
var router = express.Router();
var fs = require("fs");

let serverArray = [];

let RecipeObject = function(pCategory, pName, pTime, pIngredients, pInstructions) {
    this.ID = Math.random().toString(16).slice(5);
    this.category = pCategory;
    this.name = pName;
    this.time = pTime;
    this.ingredients = pIngredients;
    this.instructions = pInstructions;
}

let fileManager = {
  read: function() {
    var rawdata = fs.readFileSync("objectdata.json");
    let goodData = JSON.parse(rawdata);
    serverArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(serverArray);
    fs.writeFileSync("objectdata.json", data);
  },

  validData: function() {
    var rawdata = fs.readFileSync("objectdata.json");
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

// 3 Example Recipes
if(!fileManager.validData()) {
  serverArray.push(new RecipeObject("Breakfast", "Cereal", "3 min", "Cereal and Milk", "Pour cereal into a bowl followed by milk"));
  serverArray.push(new RecipeObject("Lunch", "Rice w/ egg", "10 min", "Rice, Egg(s), Soy Sauce", "Cook rice, fry egg(s), pour soy sauce on top"));
  serverArray.push(new RecipeObject("Breakfast", "PB&J", "5 min", "Bread, Peanut Butter, Jelly", "Spread peanut butter on one side of both pieces of bread, spread jelly on top of the peanut butter, put the bread together w pb&j facing inwards"));
  fileManager.write();
}
else {
  fileManager.read(); // do have prior movies so load up the array
}

console.log(serverArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all recipe data */
router.get('/getAllRecipes', function(req, res) {
  fileManager.read();
  res.status(200).json(serverArray);
});

/* Add one new Recipe */
router.post('/addRecipe', function(req, res) {
  const newRecipe = req.body;
  serverArray.push(newRecipe);
  fileManager.write();
  res.status(200).json(newRecipe);
});

/* Delete Recipe */
router.delete('/deleteRecipe/:ID', (req, res)=>{
  const delID = req.params.ID;
  let pointer = getArrayPointer(delID);
  if(pointer == -1) { // If did not find recipe in array
    console.log("Not found");
    return res.status(500).json ({
      status: "error: no such ID"
    })
  }
  else { // If did find movie
    serverArray.splice(pointer, 1); // Remove 1 element at index
    fileManager.write();
    res.send("Movie with ID: " + delID + " deleted!");
  }
})

function getArrayPointer(localID) {
  for(i=0; i<serverArray.length; i++) {
    if (localID === serverArray[i].ID) {
      return i;
    }
  }
  return -1;
}

module.exports = router;
