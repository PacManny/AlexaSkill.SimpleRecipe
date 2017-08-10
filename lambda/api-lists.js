var AWS = require("aws-sdk");
var client;
function addItemToGroceryList(id,item,callback) {
    client = new AWS.DynamoDB.DocumentClient();
    var groceryList = [];
    getGroceryList(id, (list) =>
    {
        groceryList = list;
        groceryList.push(item);
        client.putItem({
            Item: {
                "userId": {
                     S: id
                    },
                "userGroceryList": {
                    L: groceryList
                }
            },
             TableName: "MyFridge"
        }, (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Saved to DynamoDB.')
                }
            });
    });
    callback();
}

function getGroceryList(id, callback) {
    client = new AWS.DynamoDB.DocumentClient();
    var table = "MyFridge";
    var groceryList = [];

    var params = {
        TableName: table,
        Key: {
            "userId": id
        }
    };

    client.get(params, (err, dbData) => {
        if (err) {
            console.error("Unable to query DB. Error JSON:", JSON.stringify(err, null, 2));

        } else {
            groceryList = dbData.Item.userGroceryList;
            console.log(dbData.Item)
            console.log("Got the following list: " + dbData.Item.userGroceryList.join());
            callback(groceryList);
        }
    });

}

module.exports = {
    getGroceryList: getGroceryList,
    addItemToGroceryList: addItemToGroceryList
 };
