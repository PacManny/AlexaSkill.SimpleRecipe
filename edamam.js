var request = require('request');

var app_id = ''
var api_key = ''

let GetEndPoint = (item, app_id, api_key) => {
    return 'https://api.edamam.com/search?q=' +
    item + '&app_id=' + app_id + '&app_key=' + api_key + '&format=json';
}

let GetRecipeFromItem = (i, callback) => {
    var item = i;
    const endpoint = GetEndPoint(item, app_id, api_key);
    request.get(endpoint, function (error, response, body) {
        console.log(endpoint);
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
    });

};

module.exports = {
    GetRecipeFromItem: GetRecipeFromItem,
    GetEndPoint: GetEndPoint
};