/* Objects */

function TwitterUser(handle, name, picURL) {
    this.handle = handle;
    this.name = name;
    this.picURL = picURL;
}

function Tweet(text, date, user) {
    this.text = text;
    this.date = date;
    this.user = user;
}

/* Functions */

$(document).ready(function($) {
    findAllTweets("Hate", "Life");
});

function findAllTweets(emot, obj) {
    if (emot === undefined && obj === undefined) {
        var formData = $("#inputForm").serializeArray();
        emot = formData[0]["value"];
        obj = formData[1]["value"];
    }

    emot = emot.toLowerCase();
    obj = obj.toLowerCase();

    var type = classifyEmotion(emot);

    queryTwitter(emot, obj, type);
}

function displayTweets(tweets) {
    $("#dispTweets").empty();

    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        var user = tweet.user;
        // var str = "@" + user.handle + ": " + tweet.text;
        var str = tweet.text;

        var row = $("<p>");
        row.text(str);
        $("#dispTweets").append(row);
    }
}

function queryTwitter(emot, obj, type) {
    // ' Love "Obama :)" '
    var query = emot + "+" + "%22" + obj + "%22"; 

    if (type) { /* Positive attitude */
        console.log("Positive emotion!");
        query = query + "+" + "%3A%29";
    }
    else { /* Negative attitude */
        console.log("Negative emotion!");
        query = query + "+" + "%3A%28";
    }
    console.log(query);

    $.ajax({
        url:'http://emotionalapi.herokuapp.com/1.1/search/tweets.json',
        dataType: 'jsonp',
        data: {
            q: query,
            count: 200,
            lang: "en"
        },
        success: function(data, textStatus, xhr) {
            // console.log("Success!")
            console.log(data);
            var tweets = data["statuses"];

            processRawTweets(tweets);
        },
        error: function(xhr,status,error) {
            console.log("Error: " + error);
        },
    });
}

/* Parsing */

function processRawTweets(raw) {
    var tweets = toTweetObjects(raw);
    printTweets(tweets);

    displayTweets(tweets);
}

function toTweetObjects(raw) {
    var res = [];
    
    for (var i = 0; i < raw.length; i++) {
        var origTweet = raw[i];
        var rootTweet = unRTTweet(origTweet);

        var userDict = rootTweet["user"];
        var user = new TwitterUser(userDict["screen_name"],
                                   userDict["name"],
                                   userDict["profile_image_url"]);

        var tw = new Tweet(rootTweet["text"],
                           rootTweet["created_at"], 
                           user);

        if (!res.containsTweet(tw)) {
            res.push(tw);
        }
    }

    return res;
}

/* tweet: Original tweet object, not "Tweet" */
function unRTTweet(tweet) {
    var origTweet = tweet["retweeted_status"];
    if (origTweet !== undefined) {
        return origTweet;
    }
    return tweet;
}

/* NLP Stuff */

var posEmots = ["love", "like", "enjoy", "adore", "want"];
var negEmots = ["hate", "dislike", "regret", "loathe", "despise"];

/* false -> negative, true -> positive */
function classifyEmotion(emot) {
    if (negEmots.contains(emot)) {
        return false;
    }
    else {
        return true;
    }
}

/* Helpers */

function printTweets(tweets) {
    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        var user = tweet.user;
        console.log("@" + user.handle + ": " + tweet.text);
    }
}

Array.prototype.contains = function(obj) {
    return this.indexOf(obj) > -1;
}

Array.prototype.containsTweet = function(obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].text === obj.text) {
            return true;
        }
    }
    return false;
}
