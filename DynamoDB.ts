

    let AWS = require("aws-sdk");

    AWS.config.update({
        region: "eu-west-1",
        endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
    });

    //Create date object to get date in UNIX time
    let date: Date = new Date();

    //Create new DocumentClient
    let documentClient = new AWS.DynamoDB.DocumentClient();

    //Table name and data for table
    let params = {
        TableName: "Forex",
        Item: {
            PriceTimeStamp: date.getTime(),//Current time in milliseconds
            Currency: "bitcoin",
            Price: 3795.18
        }
    };

    //Store data in DynamoDB and handle errors
    documentClient.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item", params.Item.Currency);
            console.error("Error JSON:", JSON.stringify(err));
        }
        else {
            console.log("Currency added to table:", params.Item);
        }
    });

