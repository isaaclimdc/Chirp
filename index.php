<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Chirp!</title>

  <link rel="stylesheet" href="css/styles.css">
  <link href='http://fonts.googleapis.com/css?family=Ruda:400,700,900' rel='stylesheet' type='text/css'>

  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script type="text/javascript" src="http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js"></script>
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
      <img src="img/iconicon.png" height="50px" style="margin:4px">
    </div>
  </div>

  <div id="dispTweets">
    <!-- Sample entry styling -->
<!--     <div class="dispSingleTweet">
      <p class="tweetText">Hello there hello there this is just a silly sample tweet!</p>
      <p class="tweetUser">@isaaclimdc</p>
    </div> -->
  </div>
</body>

</html>
