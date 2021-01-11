    let AWS = require("aws-sdk");

//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

//Returns all of the connection IDs
module.exports.getConnectionIds = async () => {
    let params = {
        TableName: "WebsocketsClient"
    };
    return documentClient.scan(params).promise();
};

//Deletes the specified connection ID
module.exports.deleteConnectionId = async (connectionId) => {
    console.log("Deleting connection Id: " + connectionId);

    let params = { 
        TableName: "WebSocketsClients",
        Key: {
            ConnectionId: connectionId
        }
    };
    return documentClient.delete(params).promise();
};


module.exports.getData = async () => {
    let currencies = ["GBP","CAD","USD","INR", "LKR", "BTN"];
    
    let data = {
    };    
    
    for(let curr of currencies){
        data[curr] = {
            actual: {
                x: [],
                y: []
            },
            sentiment:{
                mixed:[],
                neutral:[],
                negative:[],
                positive:[]
                
            },
            predicted:{
                
            }
        };
        
        await getCurrencyData(curr, data);
        await getSentimentData(curr, data);
    }
    

    return data;
};

async function getCurrencyData(currency, data){
        /* Use index to retrieve the most recent five bitcoin prices*/
    let params = {
        TableName: "ForexData",
        Limit: 450,
        ScanIndexForward: false,
        IndexName: "Currency-PriceTimeStamp-index",
        KeyConditionExpression: "Currency = :curr",
        ExpressionAttributeValues: {
            ":curr" : currency
        }
    };
    try{
        //console.log("QUerying datab ase");
        let result = await documentClient.query(params).promise();
        //console.log(JSON.stringify(result));

        for(let item of result.Items){
           // console.log(JSON.stringify(item));
             data[currency].actual.x.push(item.PriceTimeStamp);
             data[currency].actual.y.push(item.Price);
        }
    }
    catch(err){
        console.error("ERROR ACCESSING DATABASE: " + JSON.stringify(err));
    }
    
}


async function getSentimentData(currency, data){
    let params1 = {
        TableName: "Sentiment",
        Limit: 1,
        ScanIndexForward: false,
        IndexName: "Currency-Unix-index",
        KeyConditionExpression: "Currency = :curr",
        ExpressionAttributeValues: {
            ":curr" : currency
        }
       
    };
    try{
        console.log("QUerying SENTIMENT database");
        let result = await documentClient.query(params1).promise();
        console.log(stringifyData(result));

        for(let item of result.Items){
            console.log(stringifyData(item));
            
            //Hack because some sentiment records are strings and some are objects.
            let sentimentObj = item.Sentiment;
            if(item.Sentiment.SentimentScore === undefined)
                sentimentObj = JSON.parse(item.Sentiment);
            
             //data[currency].sentiment.positive.x.push(item.Unix);
             data[currency].sentiment.positive.push(sentimentObj.SentimentScore.Positive);
            
             //data[currency].sentiment.negative.x.push(item.Unix);
             data[currency].sentiment.negative.push(sentimentObj.SentimentScore.Negative);
            
        //     data[currency].sentiment.neutral.x.push(item.Unix);
             data[currency].sentiment.neutral.push(sentimentObj.SentimentScore.Neutral);
            
          //   data[currency].sentiment.mixed.x.push(item.Unix);
             data[currency].sentiment.mixed.push(sentimentObj.SentimentScore.Mixed);

        }
    }

catch(err){
        console.error("ERROR ACCESSING DATABASE: " + stringifyData(err));         
    }
}
  
 // let result = await documentClient.scan(params).promise();
//   data.sentiment = result;





//module.exports.numData = async () => {
  // let numData = {
    //   TableName:"ForexData"
//   };
    
  //  return documentClient.scan(numData).promise();
//};


let stringifyData = (data) => {
    let dataStr = JSON.stringify(data, (key, value) => {
        if(typeof value === 'bigint')
            return value.toString();
        else
            return value; // return everything else unchanged
    });
    return dataStr;
}


