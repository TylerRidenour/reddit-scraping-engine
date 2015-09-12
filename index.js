var request = require('request');
var colors = require('colors');
var express = require('express');
var jsonfile = require('jsonfile');
var app = express();
var mkdirp = require('mkdirp');
var fs = require('fs');
var cheerio = require('cheerio');
var subReddits = ['memes', 'funny', 'pics', 'gifs', 'WTF', '4chan'];



function scrapeSubReddit(name, filename) {
  request('https://www.reddit.com/r/' + name, function(error, response, body) {
    if (!error) {

      var $ = cheerio.load(body);
      var links = Object.create(null);

      console.log(colors.green('Scraping subreddit with name: ' + colors.random(name)));

      var index = 0;
      $('.thing a').each(function(i, elem) {
          var href = elem.attribs.href;
          var isImgLink = /http:\/\/i\.imgur\.com\/(.)*/;

        if (isImgLink.test(href)) {
          links[index] = href;
          jsonfile.writeFileSync(filename, links);

          index++;
        }
      });
    } else {
      console.log(colors.red('Seems like something went wrong: ' + err));
    }
  });
}



function scrape(subreddits) {
  var date = new Date();
  for (var i = 0; i < subreddits.length; i++) {
    mkdirp('scrapes/' + subreddits[i] + '/', function(err) {
      if(err) { console.log("something went wrong: " + colors.red(err));}
    });
    scrapeSubReddit(subreddits[i], 'scrapes/' + subreddits[i] + '/' + subreddits[i] + '-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '.json');
  }
}


app.get('/api/:subreddit/:file', function(req, res) {
  var subreddit = req.params.subreddit;
  var file = req.params.file;
  res.sendFile(__dirname + '/scrapes/' + subreddit + '/' + file);
});


// Trying to think of ideas for this :/, feel free to make suggestions

scrape(subReddits);

app.listen(4847);