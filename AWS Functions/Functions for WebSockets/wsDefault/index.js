exports.handler = async (event) => {
        console.log("\nEVENT:\n" +JSON.stringify(event));
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify("ERROR. Message not recognised"),
    };
    return response;
};
