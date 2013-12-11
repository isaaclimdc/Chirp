<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Chirp!</title>
  <meta name="viewport" content="width=device-width, user-scalable=1.0">

  <link rel="stylesheet" href="css/styles.css">
  <link href='http://fonts.googleapis.com/css?family=Ruda:400,700,900' rel='stylesheet' type='text/css'>
  <link rel="icon"
        type="image/png"
        href="logo-small-bl.png">

  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
  <script type="text/javascript" src="js/spin.min.js"></script>
  <script type="text/javascript" src="js/scripts.js"></script>
</head>

<body>
  <div id="dataInput">
    <div id="title">
      <h1 id="header">HOW DO YOU FEEL?</h1>  
    </div>

    <div id="typeIn">
      <h2 id="subheaderI">I</h1>
    
      <form id="inputForm">
        <input class="form-field" id="feeling" type="text" name="feel" placeholder="hate" autocomplete="off">
        <input class="form-field" id="object" type="text" name="object" placeholder="bananas" autocomplete="off">
      </form>
    </div>
    
    <div id="chirpButton" class="form-field2" onClick="findAllTweets()">
      <img src="img/chirp_logo1.png" style="margin:5px">
    </div>
  </div>

  <div id="dispTweets">
    <!-- <h2 id="newTweetsBar">6 new chirps</h2> -->
    <!-- Sample tweet entry styling -->
<!--     <div class="dispSingleTweet">
      <p class="tweetText">Hello there hello there this is just a silly sample tweet!</p>
      <p class="tweetUser">@isaaclimdc</p>
    </div> -->
  </div>

  <div id="dispTrending">
    <h2 id="trendingTitle">Trending</h2>
    <!-- Sample trending entry styling -->
    <!-- <h3 onClick="findTweetsFromTrendingTerm('Like Apple');">Like Apple</h3> -->
  </div>
</body>

</html>
