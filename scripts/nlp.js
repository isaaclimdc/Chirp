$(document).ready(function($) {
    var queryParts = ["hate", "bananas"];
    var tweets = findTweets(queryParts[0], queryParts[1])
    console.log(tweets)
});

function findTweets(emot, obj) {
    allTweets = [];

    $.ajax({
        type: "POST",
        url: "scripts/nlp.py",
        data: { param: "hate bananas"},
        headers: {
            'Access-Control-Allow-Origin': '*',                
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            "Access-Control-Allow-Headers": "X-Requested-With"  
        }
    }).done(function( o ) {
       console.log(o);
    });

    return allTweets;
}

// function makeAPICall() {
//     $.ajax({
//         url:'http://search.twitter.com/search.json',
//             type: 'GET',
//         dataType: 'jsonp',
//         data: {
//             q: "twitter",
//             page : 1,
//             rpp :  4
//         },
//           success: function(data, textStatus, xhr) {
//               console.log(data);
//         }
//     });

//     // $.ajax({
//     //     // url: "http://api.automeme.net/text.json",
//     //     url: "https://api.twitter.com/1.1/search/tweets.json?q=nexus",
//     //     context: document.body,
//     //     crossDomain: true,
//     //     error: function(xhr,status,error) {
//     //         console.log("Error: " + error);
//     //     },
//     //     success: function(result,status,xhr) {
//     //         console.log("Success!: " + result);
//     //     }
//     // });
// }




