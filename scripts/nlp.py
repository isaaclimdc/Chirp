import os, sys, requests
from TwitterSearch import *

def findTweets(emot, obj):
    allTweets = []

    tso = TwitterSearchOrder() # create a TwitterSearchOrder object
    tso.setKeywords([emot, obj]) # let's define all words we would like to have a look for
    tso.setLanguage('en') # we want to see German tweets only
    tso.setCount(7) # please dear Mr Twitter, only give us 7 results per page
    tso.setIncludeEntities(False) # and don't give us all those entity information

    # it's about time to create a TwitterSearch object with our secret tokens
    ts = TwitterSearch(
        consumer_key = 'OQ140RxQNcjdcw5QPEiuA',
        consumer_secret = 'ZRC5ey0ewCMiQzz4vCkAFQ16PsGSS6qVjAPs6mwcxSc',
        access_token = '71796011-U45GY6aMu8UgvIZ3k7H7deorg5BwnYcWAHraxEDCO',
        access_token_secret = 'p4Ulncvq5kNlxFsmMA0amYoh4w5k3bPhe6Yng3WlVfH3z'
     )

    for tweet in ts.searchTweetsIterable(tso): # this is where the fun actually starts :)
        print('@%s: %s' % ( tweet['user']['screen_name'], tweet['text']))

    return allTweets

if __name__ == '__main__':
    return 6;
    if len(sys.argv) < 2:
        print "Error: Enter a search query"
        sys.exit(0)

    #Query is in the form "emotion object"
    queryParts = sys.argv[1].split(" ")
    if len(queryParts) != 2:
        print "Error: need both emotion and object"
        sys.exit(0)

    tweets = findTweets(queryParts[0], queryParts[1])
    print tweets