var request = require('request');
var Settings = require("applicationSettings");

// let ItilizeService = () => {
//     Settings.getApplicationService(1,"SimpleRecipeSkill","edamam", (service) => {
//         app_id = service.ApplicationIdApi;
//         api_key = service.ApplicationKeysApi;
//     });
// };

let GetEndPoint = (item, callback) => {
    Settings.getApplicationService(1, "SimpleRecipeSkill", "edamam", (service) => {
        callback('https://api.edamam.com/search?q=' +
            item + '&app_id=' + service.ApplicationIdApi + '&app_key=' + service.ApplicationKeysApi + '&format=json');

    });
}

let GetRecipeFromItem = (i, callback) => {
    var item = i;
    GetEndPoint(item, (endpoint) => {
        
        request.get(endpoint, function (error, response, body) {
            if (response.statusCode !== 200) {
                console.log(response.statusCode + ' ' + response.statusMessage);
            }
            else {
                data = JSON.parse(body);
                recipename = data["hits"][0]["recipe"]["label"].toString();
                var recipeinstructionarray = data["hits"][0]["recipe"]["ingredientLines"];
                var recipeinstruction = 'Instructions\n'
                for (var j = 0; j < recipeinstructionarray.length; j++) {
                    recipeinstruction += '- ' + recipeinstructionarray[j].toString() + '\n'
                }


                recipe = {
                    name: recipename,
                    instructions: recipeinstruction
                };
                callback(recipe);
            }
        })
    });

};

module.exports = {
    GetRecipeFromItem: GetRecipeFromItem,
    GetEndPoint: GetEndPoint
};