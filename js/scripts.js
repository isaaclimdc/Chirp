/* Globals */

var chirpAPIBaseURL = "http://chirpapi.herokuapp.com";
var chirpTrendingAPIBaseURL = "http://chirptrending.herokuapp.com";
var bkgColors = ["#e25f3b",
                 "#f06a92",
                 "#a435b7",
                 "#375edb",
                 "#fbb647",
                 "#02c987",
                 "#30c2e6"];
var tweetTimer;

var spinnerOpts = {
    lines: 11, // The number of lines to draw
    length: 0, // The length of each line
    width: 9, // The line thickness
    radius: 19, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

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
    randomizeBackground();
    getTrendingList();

    $("#object").keyup(function(event) {
        if (event.keyCode == 13) {
            findAllTweets();
        }
    });

    $('#chirpButton img').hover(function() {
        $(this).attr('src', 'img/chirp_logo2.png');
    }, function() {
        $(this).attr('src', 'img/chirp_logo1.png');
    });
});

function shrinkForm() {
    var smallHeaderFont = "2em";
    var smallSubheaderFont = "1em";

    $("h1").animate({
      fontSize: smallHeaderFont,
      marginBottom: "0%",
      marginTop: "10%"
    });
    $("#subheaderI").animate({
      fontSize: smallHeaderFont,
      marginTop: "1%"
    });
    $("#feeling").animate({  
      fontSize: smallSubheaderFont,
      marginTop: "5%"
    });
    $("#object").animate({
      fontSize: smallSubheaderFont,
    });
    $("#chirpButton").animate({
      marginLeft: "75%",
      marginTop: "-17%"
    });
    $("#dispTweets").delay(300).animate({
      opacity: "1.0",
      marginLeft: "0%"
    },700, 'easeOutCirc');
}

function randomizeBackground() {
    var bkgColIdx = Math.floor(Math.random()*bkgColors.length);
    var chosenBkgCol = bkgColors[bkgColIdx];
    $('body').css("background", chosenBkgCol);
}

function findAllTweets(emot, obj) {
    var target = document.getElementById('dispTweets');
    var spinner = new Spinner(spinnerOpts).spin(target);

    if (emot === undefined && obj === undefined) {
        var formData = $("#inputForm").serializeArray();
        emot = formData[0]["value"].toLowerCase();
        obj = formData[1]["value"].toLowerCase();

        if (emot.length == 0 || obj.length == 0) {
            return;
        }
    }

    shrinkForm();

    /* Perform the actual search */
    var type = classifyEmotion(emot);

    /* Augment trending database */
    addQueryToTrending(emot, obj);

    /* Fetch new tweets every 10 seconds */
    queryTwitter(emot, obj, type);
    window.clearInterval(tweetTimer);
    tweetTimer = window.setInterval(function() {
        queryTwitter(emot, obj, type);
        getTrendingList();
    }, 10000);
}

function findTweetsFromTrendingTerm(raw) {
    var terms = raw.split(" ");
    findAllTweets(terms[0], terms[1])
}

function displayTweets(tweets) {
    $("#dispTweets").empty();

    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        var user = "@" + tweet.user.handle;
        var text = replaceURLWithHTMLLinks(tweet.text);

        var box = $("<div>");
        box.attr("class", "dispSingleTweet");

        var tweetText = $("<p>");
        tweetText.html(text);
        tweetText.attr("class", "tweetText");
        box.append(tweetText);

        var tweetUser = $("<p>");
        tweetUser.text(user);
        tweetUser.attr("class", "tweetUser");
        box.append(tweetUser);

        $("#dispTweets").append(box);
    }
}

function displayTrending(terms) {
    $('#dispTrending').contents().filter(function () {
        return this.id != "trendingTitle";
    }).remove();

    for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        var h3 = $("<h3>");
        h3.attr("onClick", "findTweetsFromTrendingTerm('" + term + "');");
        h3.html(term);

        $("#dispTrending").append(h3);
    }
}

function queryTwitter(emot, obj, type) {
    // ' Love "Obama :)" '
    var query = emot + "+" + "%22" + obj + "%22"; 

    if (type) { /* Positive attitude */
        // console.log("Positive emotion!");
        query = query + "+" + "%3A%29";
    }
    else { /* Negative attitude */
        // console.log("Negative emotion!");
        query = query + "+" + "%3A%28";
    }
    // console.log(query);

    $.ajax({
        url: chirpAPIBaseURL + '/1.1/search/tweets.json',
        dataType: 'jsonp',
        data: {
            q: query,
            count: 50,
            lang: "en"
        },
        success: function(data, textStatus, xhr) {
            // console.log("Success!")
            // console.log(data);
            var tweets = data["statuses"];

            processRawTweets(tweets);
        },
        error: function(xhr,status,error) {
            console.log("Error: " + error);
        },
    });
}

function getTrendingList() {
    $.ajax({
        url: chirpTrendingAPIBaseURL + '/getTrending',
        data: {
            "limit" : 7
        },
        success: function(data, textStatus, xhr) {
            var trendingTerms = data["data"];
            console.log("Success!", trendingTerms);
            displayTrending(trendingTerms);
        },
        error: function(xhr,status,error) {
            console.log("Error: " + error);
        },
    });
}

function addQueryToTrending(emot, obj) {
    $.ajax({
        url: chirpTrendingAPIBaseURL + '/addQuery',
        data: {
            "emot" : emot,
            "obj" : obj
        },
        success: function(data, textStatus, xhr) {
            console.log("Success!", data);
            getTrendingList();
        },
        error: function(xhr,status,error) {
            console.log("Error: " + error);
        },
    });
}

/* Parsing */

function processRawTweets(raw) {
    var tweets = toTweetObjects(raw);
    // printTweets(tweets);

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

        if (!containsTweet(res, tw)) {
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
    if (contains(negEmots, emot)) {
        return false;
    }
    else {
        return true;
    }
}

/* Helpers */

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1'>$1</a>"); 
}

function printTweets(tweets) {
    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        var user = tweet.user;
        console.log("@" + user.handle + ": " + tweet.text);
    }
}

function contains(arr, obj) {
    return arr.indexOf(obj) > -1;
}

function containsTweet(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].text === obj.text) {
            return true;
        }
    }
    return false;
}