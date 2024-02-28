let RecipeArray = [];

let RecipeObject = function(pCategory, pName, pTime, pIngredients, pInstructions) {
    this.ID = Math.random().toString(16).slice(5);
    this.category = pCategory;
    this.name = pName;
    this.time = pTime;
    this.ingredients = pIngredients;
    this.instructions = pInstructions;
}

// 3 Example Recipes
// RecipeArray.push(new RecipeObject("Breakfast", "Cereal", "3 min", "Cereal and Milk", "Pour cereal into a bowl followed by milk"));
// RecipeArray.push(new RecipeObject("Lunch", "Rice w/ egg", "10 min", "Rice, Egg(s), Soy Sauce", "Cook rice, fry egg(s), pour soy sauce on top"));
// RecipeArray.push(new RecipeObject("Breakfast", "PB&J", "5 min", "Bread, Peanut Butter, Jelly", "Spread peanut butter on one side of both pieces of bread, spread jelly on top of the peanut butter, put the bread together w pb&j facing inwards"));

$(document).on("pagebeforeshow", "#add-recipe", function() {

    $("#buttonAdd").on("click", function() {
        const category = $("#recipe-category").val();
        const name = $("#recipe-name").val();
        const time = $("#recipe-time").val();
        const ingredients = $("#recipe-ingredients").val();
        const instructions = $("#recipe-instructions").val();

        // Validates forms are filled out
        if (category && name && time && ingredients && instructions) { 
            let newRecipe = new RecipeObject(category, name, time, ingredients, instructions);
            //document.location.href = "#view-recipes";
            $("#recipe-category, #recipe-name, #recipe-time, #recipe-ingredients, #recipe-instructions").val("");
            createList();

            $.ajax({
                url: "/addRecipe",
                type: "POST",
                data: JSON.stringify(newRecipe),
                contentType: "application/json; charset=utf-8",
                success: function(result) {
                    console.log(result);
                    document.location.href= "#view-recipes";
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("Server could not add Recipe: " + newRecipe.name);
                    alert(textStatus + " " + errorThrown);
                }
            })
        } else {
            alert("Please fill in all fields before adding a recipe.");
        }
    });
});

$(document).on("pagebeforeshow", "#view-recipes", function() {
    createList(); // Updates the view-recipes page
});

$(document).on("pagebeforeshow", "#details", function(event) {
    let localID = localStorage.getItem("parm");
    let pointer = GetObjectPointer(localID);
    RecipeArray = JSON.parse(localStorage.getItem("RecipeArray"));

    document.getElementById("oneName").innerHTML = RecipeArray[pointer].name + "<hr>";
    document.getElementById("oneCategory").innerHTML = "Category: " + RecipeArray[pointer].category;
    document.getElementById("oneTime").innerHTML = "Cook Time: " + RecipeArray[pointer].time;
    document.getElementById("oneIngredients").innerHTML = "Ingredients: " + RecipeArray[pointer].ingredients;
    document.getElementById("oneInstructions").innerHTML = "Instructions: " + RecipeArray[pointer].instructions;
})

function GetObjectPointer(whichID) {
    for(i = 0; i < RecipeArray.length; i++) {
        if(RecipeArray[i].ID == whichID) {
            return i;
        }
    }
}

function createList() {
    var myul = $("#recipe-list");
    myul.empty();

    $.get("/getAllRecipes", function(data, status) { // AJAX Get
        RecipeArray = data; // Copy returned server json data into local array
        // Now inside this "call back" anonymous function,
        // update the webpage with this new data
    

        RecipeArray.forEach(function(element, index) {
            var li = $("<li>").html("<b>" + element.name + " [" + element.category + "] (" + element.time + ") </b><br> <i>Ingredients:</i> " + element.ingredients);
            li.addClass("oneRecipe");
            li.attr("data-parm", element.ID);
            var deleteButton = $("<button>").text("Delete").addClass("delete-button").data("index", index);
            li.append(deleteButton);
            myul.append(li);
        });

        var liList = document.getElementsByClassName("oneRecipe");
        let newRecipeArray = Array.from(liList);

        newRecipeArray.forEach(function(element) {
            element.addEventListener ("click", function() {
                var parm = this.getAttribute("data-parm");
                localStorage.setItem("parm", parm);

                let stringRecipeArray = JSON.stringify(RecipeArray);
                localStorage.setItem("RecipeArray", stringRecipeArray);

                document.location.href = "#details";

            })
        })
    })

    $(".delete-button").on("click", function() { //delete buttons
        var indexToRemove = $(this).data("index");
        RecipeArray.splice(indexToRemove, 1); // Remove the recipe at the specified index
        createList();
    });
}
