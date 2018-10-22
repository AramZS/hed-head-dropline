/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express(),   
    Twit = require('twit'),
    feedHandler = require('./feedHandler'),
    hedTransform = require('./hed-transform'),
    config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter);

app.use(express.static('public'));

async function makeAHeadline(feedItem) {

  // const feedLatest = setOfFeedItems[0];
  const feedItemTitle = feedItem.title;
  var firstElement = feedItemTitle.split('|').shift();
  return await hedTransform.shuffleTheReturn(feedItemTitle);
};

/* You can use cron-job.org, uptimerobot.com, or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

async function genTitle(req, res, level) {
  
  const feedItemSet = await feedHandler.feedItems();
  const feedLatest = feedItemSet[level];
  let aGreatTweet = '';
  const hed = await makeAHeadline(feedLatest);
  aGreatTweet += hed;
  aGreatTweet += ' '+feedLatest.link;
  T.post('statuses/update', { status: aGreatTweet }, function(err, data, response) {
    if (err){
      console.log('error!', err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  });
};

async function genLastTitle(req, res){
  return await genTitle(req, res, 1);
};


async function genLatestTitle(req, res){
  return await genTitle(req, res, 0);
};

async function genTestTitle(req, res){
  const feedItemSet = await feedHandler.feedItems();
  const feedLatest = feedItemSet[0];
  let aGreatTweet = '';
  const hed = await makeAHeadline(feedLatest);
  aGreatTweet += hed;
  aGreatTweet += ' '+feedLatest.link;
  res.json({result: aGreatTweet})
}

app.get("/" + process.env.BOT_ENDPOINT, genLastTitle );
app.get("/" + process.env.MAN_ENDPOINT, genLatestTitle );
app.get("/" + process.env.TEST_ENDPOINT, genTestTitle );


var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port);
});
