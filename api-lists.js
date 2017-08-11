var AWS = require("aws-sdk");
var client;
function addItemToGroceryList(id, item, callback) {
    client = new AWS.DynamoDB.DocumentClient();
    var groceryList = [];
    getGroceryList(id, (list) => {
        if (list != undefined) {
            groceryList = list;
            console.log(groceryList);
        }
        groceryList.push(item);
        var params =
            {
                TableName: "MyFridge",
                Item: {
                    "userGroceryList": groceryList,
                    "userId": id
                }
            };

        client.put(params, handleDBPut);
        callback();
    });
}


function getGroceryList(id, callback) {
    client = new AWS.DynamoDB.DocumentClient();
    var table = "MyFridge";
    var groceryList = undefined;

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
            if (dbData.Item != undefined) {
                groceryList = dbData.Item.userGroceryList;
                console.log(dbData.Item)
                console.log("Got the following list: " + dbData.Item.userGroceryList.join());
            }
            callback(groceryList);
        }
    });

}

function removeItemFromGroceryList(id, item, callback) {
    client = new AWS.DynamoDB.DocumentClient();
    var groceryList = [];
    var success = false;
    getGroceryList(id, (list) => {
        if (list != undefined) {
            groceryList = list;
            console.log(groceryList);
            if (groceryList.includes(item)) {

                var itemIndex = groceryList.indexOf(item);
                groceryList.splice(itemIndex,1);
                console.log(groceryList);
                var params =
                    {
                        TableName: "MyFridge",
                        Item: {
                            "userGroceryList": groceryList,
                            "userId": id
                        }
                    };

                client.put(params, handleDBPut);
                success = true;
            }
        }
        callback(success);
    });

}

function handleDBPut(error, data) {
    if (error) {
        console.log("handleDBPutErrors() " + error);
    } else {
        console.log('handleDBPut() ' + JSON.stringify(data))
    }

}

// function handleDBGet (error, data) {
//  if (err) {
//             console.error("handleDBGet() Unable to query DB. Error JSON:", JSON.stringify(err, null, 2));

//         } else {
//             console.log("Returned: " + data)

//             return data;
//         }
// }

module.exports = {
    getGroceryList: getGroceryList,
    addItemToGroceryList: addItemToGroceryList,
    removeItemFromGroceryList: removeItemFromGroceryList
};
