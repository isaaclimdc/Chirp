$(document).ready(function($) {
    var queryParts = ["hate", "bananas"];
    findAllTweets(queryParts[0], queryParts[1])
});

function processRawTweets(raw) {
    allTweets = [];

    return allTweets;
}

function findAllTweets(emot, obj) {
    $.ajax({
        url:'http://emotionalapi.herokuapp.com/1.1/search/tweets.json',
        type: 'GET',
        dataType: 'jsonp',
        data: {
            q: emot + obj,
            // page : 1,
            // rpp :  4
        },
        success: function(data, textStatus, xhr) {
            console.log("Success!: " + data);

            processRawTweets(data)
        },
        error: function(xhr,status,error) {
            console.log("Error: " + error);
        },
    });
}




