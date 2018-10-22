var feedReader = require('feed-reader');

const feedItems = () => {
  let url = process.env.FEED;
  let itemSet = [];
  return new Promise(function(resolve, reject) {
    feedReader.parse(url).then((feed) => {
      // console.log(feed);
      let c = 0;
      for (let item of feed.entries) {
        if (c >= 3){
          break;
        };
        console.log(item.title + ':' + item.link)
        itemSet.push(item);
        c++;
      };
      resolve(itemSet);
    }).catch((err) => {
      console.log(err);
      resolve([]);
    }).finally(() => {
      console.log('Everything done');
    });
  });
}

module.exports = {
  feedItems: feedItems
};