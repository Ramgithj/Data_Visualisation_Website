//Import external library with websocket functions
let ws = require('websocket');

//Import functions for database
let db = require('database');

exports.handler = async (event) => {
    try {
        //FOR EXAMPLE
        if(event.requestContext.connectionId === undefined){
            //TRIGGERED BY DYNAMO DB
            //SEND TO ALL CLIENTS
        }
        else{
            //SEND TO ONE CLIENT
        }
        
        //Get connection ID from event
        let connId = event.requestContext.connectionId;
        console.log("Client connected with ID: " + connId);
        
        //Get Message from event
        let data = await db.getData();
        console.log("DATA: " + stringifyData(data));

        //Get domain name and stage from event
        let domainName = event.requestContext.domainName;
        let stage = event.requestContext.stage;
        console.log("Domain: " + domainName + " stage: " + stage);

        //Get promises message to connected clients
        let sendMsgResult = await ws.sendMessage(connId, stringifyData(data), domainName, stage);
        console.log("Message sent to: " + connId + ": " + JSON.stringify(sendMsgResult));
    }
    catch(err){
        return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
};


let stringifyData = (data) => {
    let dataStr = JSON.stringify(data, (key, value) => {
        if(typeof value === 'bigint')
            return value.toString();
        else
            return value; // return everything else unchanged
    });
    return dataStr;
}





