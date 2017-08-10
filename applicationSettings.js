let AWS = require("aws-sdk");
let client;

let getApplicationService = (applicationId, applicationName, serviceName, callback) => {
    client = new AWS.DynamoDB.DocumentClient();
    var table = "ApplicationSettings";
     applicationService = undefined;

    var params = {
        TableName: table,
        Key: {
            "ApplicationId": applicationId,
            "ApplicationName": applicationName
        }
    };

    client.get(params, (err, dbData) => {
        if (err) {
            console.error("Unable to query DB. Error JSON:", JSON.stringify(err, null, 2));

        } else {

            dbData.Item.ApplicationServices.forEach((element) => { 
                if(element.ServiceName == serviceName)
                    applicationService = element;
                else
                    console.log("This application does not have a service with a service name of " + serviceName);
            });
            callback(applicationService);
        }
    });
}

module.exports = {
    getApplicationService: getApplicationService
};