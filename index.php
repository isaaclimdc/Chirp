<!DOCTYPE html>
<html>

<head>
  <title>Title</title>
  <meta charset="UTF-8">
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script type="text/javascript" src="scripts/nlp.js"></script>
</head>

<body>
  <form id="inputForm">
    Emotion: <input type="text" name="inputEmotion"><br>
    Object: <input type="text" name="inputObject"><br>
  </form>
  <div onClick="findAllTweets()">
    <h2>Go!</h2>
  </div>
</body>

</html>