var Alexa = require('alexa-sdk');
var Edamam = require('edamam');
var GroceryList = require('api-lists');
exports.handler = function (event, context, callback) {
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
    'LaunchRequest': function () {
        this.emit(':ask', 'Tell me a food item and I will give you a recipe! Or you can add items to your grocery list.',
            'Try saying a name of a food item.',
            'Try adding an item to your grocery list.');
    },

    'FoodItemName': function () {
        var itemName = this.event.request.intent.slots.foodItem.value;
        Edamam.GetRecipeFromItem(itemName, (recipe) => {
            var speechOutput = 'I found the recipe '
                + recipe.name +
                ', I have sent you a card with more information about this recipe.';
            this.emit(':tellWithCard', speechOutput, recipe.name, recipe.instructions)
        })
    },

    'AddItemToGroceryList': function () {
        var itemName = this.event.request.intent.slots.foodItem.value;
        var userId = this.event.session.user.userId;
        console.log(userId);
        GroceryList.addItemToGroceryList(userId, itemName, () => {

            this.emit(':tell', "I have added " + itemName + " to your list.")
        });
    },

    'GetGroceryList': function () {
        var userId = this.event.session.user.userId;
        GroceryList.getGroceryList(userId, (list) => {
            var length = list.length;
            var lastItemList = "";
            var firstItems = [];
            if (length > 1) {
                firstItems = list.slice(0, length - 1);
                lastItemList = " and " + list.slice(firstItems.length, length).join();
            }
            else {
                firstItems = list;
            }
            this.emit(':tell', "You have " + firstItems.join() + lastItemList + " on your grocery list.")
        });
    },

    'RemoveItemFromGroceryList': function() {
        var itemName = this.event.request.intent.slots.foodItem.value;
        var userId = this.event.session.user.userId;
        GroceryList.removeItemFromGroceryList(userId, itemName, (success) =>
    {
        var successString;
        if(success){
            successString = " was successfuly removed from you grocery list. "
        }
        else{
            successString = " was not successfully removed from you grocery list. " 
            + "Either that item was already removed, or you have not created a grocery list."
        }

        this.emit(':tell', itemName+successString);

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

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', `You can tell a name of a food item and I will try to get a recipe for you.  What kind of recipr would you like me to search for?`, `What recipe would you like me to find?`);
    },
    'Unhandled': function () {
        this.emit(':ask', `You can tell a name of a food item and I will try to get a recipe for you.  What kind of recipr would you like me to search for?`, `What recipe would you like me to find?`); this.emit(':ask', `You can tell me the name of a musical artist and I will say it back to you.  Who would you like me to find?`, `Who would you like me to find?`);
    }
}