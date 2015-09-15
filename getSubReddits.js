var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');


for (var i = 2; i < 33; i++) {
  request('http://redditlist.com/?page=' + i, function(err, res, body) {
    if(err) throw err;
    var $ = cheerio.load(body);
    var subRedditNames = [];
    $('.listing-item').each(function(i, elem) {
      var subredditName = elem.attribs["data-target-subreddit"];
      subRedditNames.push(subredditName);
    });
    jsonfile.writeFileSync('names.json', {
      names: subRedditNames
    });
  });
}
