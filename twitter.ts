//Module that reads keys from .env file
const dotenv = require('dotenv');

//Node Twitter library
const Twitter = require('twitter');

//Database module
import { saveData } from "./database_function";

//Copy variables in file into environment variables
dotenv.config();

//Set up the Twitter client with the credentials
let client = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET_KEY,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_SECRET_TOKEN
});

//Function downloads and outputs tweet text
async function storeTweets(keyword: string){
    try{
        //Set up parameters for the search
        let searchParams = {
            q: keyword,
            count: 10,
            lang: "en"
        };

        //Wait for search to execute asynchronously
        let twitterResult = await client.get('search/tweets', searchParams);

        //Output the result
        let promiseArray: Array< Promise<string> > = [];
        twitterResult.statuses.forEach((tweet)=>{
            console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text + ". Created at: " + tweet.created_at);

            //Store save data promise in array
            promiseArray.push(saveData(tweet.id, tweet.text, tweet.created_at));
        });

        //Execute all of the save data promises
        let databaseResult: Array<string> = await Promise.all(promiseArray);
        console.log("Database result: " + JSON.stringify(databaseResult));
    }
    catch(error){
        console.log(JSON.stringify(error));
    }
};

//Call function to search for tweets with specified subject
storeTweets("BTN ");

