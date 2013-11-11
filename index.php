<!DOCTYPE html>
<html>

<head>
  <title>Chirp!</title>
  <meta charset="UTF-8">
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script type="text/javascript" src="scripts/nlp.js"></script>
</head>

<body>
  <div style="float:right; cursor:pointer">
    <h3>Login with Twitter</h3>
  </div>
  <form id="inputForm">
    Emotion: <input type="text" name="inputEmotion"><br>
    Object: <input type="text" name="inputObject"><br>
  </form>
  <div onClick="findAllTweets()" style="cursor:pointer">
    <h2>Go!</h2>
  </div>
  <div id="dispTweets">
  </div>
</body>

</html>