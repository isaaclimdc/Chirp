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
    var tweets = sanitizeTweets(raw);
    printTweets(tweets);

    displayTweets(tweets);
}

function displayTweets(tweets) {
    $("#dispTweets").empty();

    for (var i = 0; i < tweets.length; i++) {
        var row = $("<p>");
        row.text(tweets[i]);
        $("#dispTweets").append(row);
    }
}

function queryTwitter(emot, obj) {
    $.ajax({
        url:'http://emotionalapi.herokuapp.com/1.1/search/tweets.json',
        dataType: 'jsonp',
        data: {
            q: emot + " " + obj,
            count: 200 
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

function sanitizeTweets(raw) {
    var res = [];
    for (var i = 0; i < raw.length; i++) {
        res[i] = raw[i]["text"];
    }
    return res;
}

function printTweets(raw) {
    for (var i = 0; i < raw.length; i++) {
        console.log(raw[i]);
    }
}