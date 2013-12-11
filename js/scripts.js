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
var currentlyDisplayedTweets;

var spinnerOpts = {
    lines: 11, // The number of lines to draw
    length: 0, // The length of each line
    width: 9, // The line thickness
    radius: 19, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb or array of colors
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

TwitterUser.prototype.equals = function(other) {
    return this.handle === other.handle;
}

function Tweet(text, date, user) {
    this.text = text;
    this.date = date;
    this.user = user;
}

Tweet.prototype.equals = function(other) {
    return this.text === other.text && this.user.equals(other.user);
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

function shrinkFormLarge() {
    var smallHeaderFont = "2em";
    var smallSubheaderFont = "1em";

    $("h1").animate({
      fontSize: smallHeaderFont,
      marginBottom: "0%",
      marginTop: "10%",
      marginLeft: "0%",
    });
    $("#subheaderI").animate({
      fontSize: smallHeaderFont,
      marginTop: "-5%"
    });
    $("#feeling").animate({  
      fontSize: smallSubheaderFont,
    });
    $("#object").animate({
      fontSize: smallSubheaderFont,
    });
    $("#chirpButton").animate({
      marginLeft: "75%",
      marginTop: "-17%",
      height:"60px",
      width:"60px",
    });
    $("img").animate({
      height:"50px",
      width:"50px",
    });
    $("#dispTweets").delay(300).animate({
      opacity: "1.0",
      marginLeft: "0%"
    },700, 'easeOutCirc');
}

function shrinkFormMiddle() {
    var smallHeaderFont = "2.3em";
    var smallSubheaderFont = "1em";
    var formFont = "1.5em";
    $("#inputForm").animate({
      fontSize: formFont,
      marginBottom: "0%",
      marginTop: "10%",
      marginTop: "-2%"
    });
    $("#dispTrending").animate({
      opacity: "0",
    });
    $("h1").animate({
      fontSize: smallHeaderFont,
      marginBottom: "0%",
      marginTop: "10%"
    });
    $("#subheaderI").animate({
      fontSize: formFont,
      marginTop: "-4%"
    });
    $("#feeling").animate({  
      fontSize: smallSubheaderFont,
    });
    $("#object").animate({
      fontSize: smallSubheaderFont,
    });
    $("#chirpButton").animate({
      marginLeft: "83%",
      marginTop: "-53px",
      height:"50px",
      width:"50px",
    });
    $("img").animate({
      height:"40px",
      width:"40px",
    });
    $("#dispTweets").delay(300).animate({
      width:"70%",
      opacity: "1.0",
      margin: "auto",
      marginLeft: "18%",
      marginTop: "26%",
    },700, 'easeOutCirc');
}

function shrinkFormSmall() {
    var smallHeaderFont = "1.7em";
    var smallSubheaderFont = "1em";
    var formFont = "1.5em";
    $("#inputForm").animate({
      fontSize: smallSubheaderFont,
      marginBottom: "0%",
      marginTop: "-1%",
      width:"70%"
    });
    $("h1").animate({
      fontSize: smallHeaderFont,
      marginLeft: "10%",
      marginTop: "10%"
    });
    $("#subheaderI").animate({
      fontSize: smallSubheaderFont,
      marginTop: "10%"
    });
    $("#feeling").animate({  
      fontSize: smallSubheaderFont,
    });
    $("#object").animate({
      fontSize: smallSubheaderFont,
    });
    $("#dispTweets").delay(300).animate({
      width:"90%",
      opacity: "1.0",
      margin: "auto",
      marginLeft: "5%",
      marginTop: "26%",
    },700, 'easeOutCirc');
    $("#chirpButton").animate({
      marginLeft: "78%",
      marginTop: "-53px",
      height:"50px",
      width:"50px",
    });
    $("img").animate({
      height:"40px",
      width:"40px",
    });
}

function condResize() {
    var windowWidth  = $(window).width();
    if (windowWidth >= 700)              
        shrinkFormLarge();
    else if (windowWidth >= 480)           
        shrinkFormMiddle();
    else
        shrinkFormSmall();
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
    
    condResize();

    /* Perform the actual search */
    var type = classifyEmotion(emot);

    /* Augment trending database */
    addQueryToTrending(emot, obj);

    /* Fetch new tweets every 10 seconds */
    queryTwitter(emot, obj, type, function(tweets) { displayTweets(tweets); });
    window.clearInterval(tweetTimer);
    tweetTimer = window.setInterval(function() {
        queryTwitter(emot, obj, type, function(tweets) { updateNewTweetsBar(tweets); });
        getTrendingList();
    }, 10000);
}

function findTweetsFromTrendingTerm(raw) {
    var terms = raw.split(" ");
    var emot = terms.slice(0, 1)[0];
    var objWords = terms.slice(1, terms.length);
    var obj = objWords.join(" ");
    console.log(emot, obj);
    findAllTweets(emot, obj);
    $(".form-field#feeling").val(emot);
    $(".form-field#object").val(obj);
}

function displayTweets(tweets) {
    $('#dispTweets').empty();

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

    /* Remember these as the currently displayed tweets */
    currentlyDisplayedTweets = tweets;
}

function updateNewTweetsBar(tweets) {
    var numNew = countNumNew(tweets);
    var newText = numNew + " new chirp" + (numNew == 1 ? "" : "s");
    console.log(newText);

    if (numNew == 0) return;

    var existingBar = $("#dispTweets #newTweetsBar");
    if (existingBar.length == 0) {
        existingBar = $("<h2>");
        existingBar.attr("id", "newTweetsBar");
        existingBar.attr("onClick", "findAllTweets();");
        $("#dispTweets").prepend(existingBar);
    }
    
    existingBar.html(newText);
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

function queryTwitter(emot, obj, type, successFn) {
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
            count: 30,
            lang: "en"
        },
        success: function(data, textStatus, xhr) {
            var raw = data["statuses"];
            var tweets = toTweetObjects(raw);
            successFn(tweets);
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

function countNumNew(tweets) {
    var cnt = 0;
    for (var i = 0; i < tweets.length; i++) {
        var contains = false;
        for (var j = 0; j < currentlyDisplayedTweets.length; j++) {
            if (tweets[i].equals(currentlyDisplayedTweets[j])) {
                contains = true;
            }
        }
        if (contains == false) {
            cnt++;
        }
    }
    return cnt;
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
    return text.replace(exp,"<a href='$1' target='blank'>$1</a>"); 
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
