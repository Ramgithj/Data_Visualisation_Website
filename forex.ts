//Time library that we will use to increment dates.
const moment = require('moment');

//Axios will handle HTTP requests to web service
const axios = require ('axios');

//Reads keys from .env file
const dotenv = require('dotenv');

//Copy variables in file into environment variables
dotenv.config();


let AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
});
//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

//Class that wraps fixer.io web service
export class Forex {
    //Base URL of fixer.io API
    baseURL: string = "http://data.fixer.io/api/";

    //Returns a Promise that will get the exchange rates for the specified date
    getExchangeRates(date: string): Promise<object> {
        //Build URL for API call
        let url:string = this.baseURL + date + "?";
        url += "access_key=" + process.env.SECRET_KEY;
        url += "&symbols=LKR,INR,USD,CAD,GBP,BTN";

        //Output URL and return Promise
       // console.log("Building fixer.io Promise with URL: " + url);
        return axios.get(url);
    }
}


//Gets the historical data for a range of dates.
async function getHistoricalData(startDate: string, numDays: number){
    /* You should check that the start date plus the number of days is
    less than the current date*/

    //Create moment date, which will enable us to add days easily.
    let date = moment(startDate);

    //Create instance of Fixer.io class
    let forexIo: Forex = new Forex();

    //Array to hold promises
    let promiseArray: Array<Promise<object>> = [];

    //Work forward from start date
    for(let i: number =0; i<numDays; ++i){
        //Add axios promise to array
        promiseArray.push(forexIo.getExchangeRates(date.format("YYYY-MM-DD")));

        //Increase the number of days
        date.add(1, 'days');
    }

    //Wait for all promises to execute
    try {
        let resultArray: Array<object> = await Promise.all(promiseArray);

        //Output the data  
        resultArray.forEach((result)=>{
            //console.log(result);
            //data contains the body of the web service response
            let data: ForexObject = result['data'];

            //Check that API call succeeded.
            if(data.success != true){
                console.log("Error: " + JSON.stringify(data.error));
            }
            else{
                //Output the result - you should put this data in the database
                console.log("Date: " + data.date +
                    "LKR: " + data.rates.LKR +
                    "INR: " + data.rates.INR,
                "USD: " + data.rates.USD,
                "GBP: " + data.rates.GBP,
                "CAD: " + data.rates.CAD,
                    "BTN: " + data.rates.BTN


            );

                let tmpDate = new Date(data.date);
                storeData("LKR", tmpDate.valueOf(), data.rates.LKR);
                storeData("INR", tmpDate.valueOf(), data.rates.INR);
                storeData("GBP", tmpDate.valueOf(), data.rates.GBP);
                storeData("CAD", tmpDate.valueOf(), data.rates.CAD);
                storeData("BTN", tmpDate.valueOf(), data.rates.BTN);
                storeData("USD", tmpDate.valueOf(), data.rates.USD);


            }
        });
    }
    catch(error){
        console.log("Error: " + JSON.stringify(error));
    }
}


function storeData(currency: string, ts: number, price: number): void {
    let params = {
        TableName: "ForexData",
        Item: {
            Currency: currency,
            Price: price,
            PriceTimeStamp: ts //Current time in milliseconds

        }
    };

    //Store data in DynamoDB and handle errors
    documentClient.put(params, (err, data ) => {
        if (err) {
            console.error("Unable to add item", params.Item.Currency);
            console.error("Error JSON:", JSON.stringify(err));
        }
        else {
            console.log("Currency added to table:", params.Item);
        }
    });
}

//Call function to get historical data
getHistoricalData('2020-01-01', 313);
