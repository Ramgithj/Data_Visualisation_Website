let AWS = require("aws-sdk");

//Save in sentiment table using id, unix time stamp and sentiment
let documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try{
       for(let i=0; i<event.Records.length; i++){
            let record = event.Records[i];    
       
            console.log(JSON.stringify(record.dynamodb.NewImage));
            let id = record.dynamodb.NewImage.id.N;
            console.log("ID: " + id);
            
            let Text = record.dynamodb.NewImage.tweet.S;
            console.log("Text: " + Text);
        
            let Currency = record.dynamodb.NewImage.Currency.S;
            console.log("Currency: " + Currency);
            
            let Createdat = record.dynamodb.NewImage.createdAt.S;
           let unixTS = new Date(Createdat).valueOf();
            console.log("UNIX: " + unixTS);
           
            //Parameters for call to AWS Comprehend
            let params = {
                LanguageCode: "en",//Possible values include: "en", "es", "fr", "de", "it", "pt"
                Text: Text
            };
            
            //Create instance of Comprehend
            let comprehend = new AWS.Comprehend();
            let result = await comprehend.detectSentiment(params).promise();
            console.log(JSON.stringify(result));
        
            params = {
                TableName: "Sentiment",
                Item: {
                    id: Number(id),
                    Text: Text,
                    Unix: unixTS,
                    Sentiment: result,
                    Currency: Currency,
                    
                }
            };
    
       
            result = await documentClient.put(params).promise();
            console.log(JSON.stringify(result));
            console.log("Data Stored");

       }
   }
   catch(err){
       console.error(JSON.stringify(err));
   }
     
   
};
    


