var Alexa = require('alexa-sdk');
var Edamam = require('edamam');
var GroceryList = require('api-lists');
exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    // if(event.session.user.accessToken == undefined)
    // {
    //     alexa.emit(':tellWithLinkAccountCard','to start using this skill please use the companion app to authenticate on Amazon');
    //     return;
    // }
    alexa.registerHandlers(handlers)
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function() {
        this.emit(':ask', 'Tell me a food item and I will give you a recipe!', 'Try saying a name of a food item.');
    },

    'FoodItemName': function() {
        var itemName = this.event.request.intent.slots.foodItem.value;
        Edamam.GetRecipeFromItem(itemName, (recipe) => {
            var speechOutput = 'I found the recipe ' 
                                + recipe.name + 
                                ', I have sent you a card with more information about this recipe.';
           this.emit(':tellWithCard', speechOutput, recipe.name , recipe.instructions )
        })
    },

    'AddItemToGroceryList': function()
    {
        var itemName = this.event.request.intent.slots.foodItem.value;
        GroceryList.addItemToGroceryList("12345678",itemName, () =>
        {
           this.emit(':tell', "I have added " + itemName + " to your list.") 
        });
    },

    'GetGroceryList': function()
    {
        GroceryList.getGroceryList("12345678", (list) =>
        {         
        this.emit(':tell', "You have " + list.join() + " on your grocery list.")
        });
    },

    'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

   'AMAZON.HelpIntent' : function () {
   this.emit(':ask', `You can tell a name of a food item and I will try to get a recipe for you.  What kind of recipr would you like me to search for?`,  `What recipe would you like me to find?`);
  },
  'Unhandled' : function () {
     this.emit(':ask', `You can tell a name of a food item and I will try to get a recipe for you.  What kind of recipr would you like me to search for?`,  `What recipe would you like me to find?`);  this.emit(':ask', `You can tell me the name of a musical artist and I will say it back to you.  Who would you like me to find?`,  `Who would you like me to find?`);
  }
}