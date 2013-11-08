$(document).ready(function($) {
    queryTwitter("Love", "Bananas");
});

function findAllTweets() {
    var formData = $("#inputForm").serializeArray();
    var emot = formData[0]["value"];
    var obj = formData[1]["value"];

    queryTwitter(emot, obj);
}

function processRawTweets(raw) {
    console.log(raw);

    allTweets = [];

    return allTweets;
}

function queryTwitter(emot, obj) {
    $.ajax({
        url:'http://emotionalapi.herokuapp.com/1.1/search/tweets.json',
        dataType: 'jsonp',
        data: {
            q: emot + " " + obj,
        },
        success: function(data, textStatus, xhr) {
            console.log("Success!")
            var tweets = data["statuses"];

            processRawTweets(tweets);
        },
        error: function(xhr,status,error) {
            console.log("Error: " + error);
        },
    });
}
