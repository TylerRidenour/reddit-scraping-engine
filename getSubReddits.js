var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');


request('http://redditlist.com', function(err, res, body) {
  var $  = cheerio.load(body);
  var subRedditNames = [];
  $('.listing-item').each(function(i, elem) {
    var subredditName = elem.attribs["data-target-subreddit"]
        subRedditNames.push(subredditName);
  });
  jsonfile.writeFileSync('links.json', {names: subRedditNames});
  });
