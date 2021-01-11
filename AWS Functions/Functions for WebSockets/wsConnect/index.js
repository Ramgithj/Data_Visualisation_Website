 // TODO implement
let AWS = require("aws-sdk");
let documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

     //Get Connection Id
     let connId = event.requestContext.connectionId;
     console.log("Client connected with ID" + connId);
    
    //Store connection Id
    let params = {
        TableName: "WebsocketsClient",
        Item: {
            ConnectionId: connId
        }
    };
    
    try {
         await documentClient.put(params).promise();
         console.log("Connection ID stored.");
        
        return {
            statusCode: 200,
            body:"Client connected with ID: "// + connId 
        };
        
    }
    catch (err) {
        console.log("Error storing Connection ID" + JSON.stringify(err));
        return{
             statusCode: 500,
            body:"Server Error: " + JSON.stringify(err)
        };
    }
};