//Import AWS
let AWS = require("aws-sdk");

//Data that we are going to send to endpoint
//REPLACE THIS WITH YOUR OWN DATA!
let endpointData = {
    "instances":
        [
            {
            "start":"2020-03-28 23:12:00",
            "cat":4,
            "target": [196.334033,196.008857,196.470106,195.555919,195.409695,196.938104,197.080137,197.080137,197.853834,198.204058,199.961463,201.559227,200.732913,201.17663,201.572847,202.569283,203.890234,202.667171,202.527054,202.107906,202.556348,202.556348,202.23366,202.639186,201.75758,201.105863,200.115805,200.670209,200.670209,200.040115,201.916424,202.42432,203.817086,204.476717,204.511627,204.511627,204.762023,204.67822,204.911419,204.27402,203.505991,203.501565,203.558272,203.572096,203.886281,203.675769,203.168169,201.823559,201.823591,201.823591,201.660812,201.074759,202.088204,200.489498,201.355412,201.562075,201.477448,201.528147,201.865121,203.65829,202.014006,202.360865,202.407647,202.407647,204.949485,206.029315,206.812132,207.507528,206.330948,206.10996,207.079002,205.56506,207.43427,206.998574,206.684536,206.448439,206.581694,206.581694,206.815057,207.848148,208.115548,209.08709,208.499832,208.677141,208.677141,209.472999,210.822843,209.170594,209.223569,208.519892,208.254237,208.254237,208.34532,207.043133,209.557518,210.168225,209.345379,209.323872,209.323872,208.425815,206.384034]
            }
        ],
    "configuration":
        {
            "num_samples": 50,
            "output_types":["mean","quantiles","samples"],
            "quantiles":["0.1","0.9"]
        }
};

//Name of endpoint
//REPLACE THIS WITH THE NAME OF YOUR ENDPOINT
const endpointName = "numerical-endpoint";

//Parameters for calling endpoint
let params = {
    EndpointName: endpointName,
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json"
};

//AWS class that will query endpoint
let awsRuntime = new AWS.SageMakerRuntime({});

//Handler for Lambda function
exports.handler = event => {
    //Call endpoint and handle response
    awsRuntime.invokeEndpoint(params, (err, data)=>{
        if (err) {//An error occurred
            console.log(err, err.stack);

            //Return error response
            const response = {
                statusCode: 500,
                body: JSON.stringify('ERROR: ' + JSON.stringify(err)),
            };
            return response;
        }
        else{//Successful response
            //Convert response data to JSON
            let responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'));
            console.log(JSON.stringify(responseData));

            //TODO: STORE DATA IN PREDICTION TABLE

            //Return successful response
            const response = {
                statusCode: 200,
                body: JSON.stringify('Predictions stored.'),
            };
            return response;
        }
    });
};

