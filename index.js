var request = require('request');
var colors = require('colors');
var express = require('express');
var jsonfile = require('jsonfile');
var app = express();
var mkdirp = require('mkdirp');
var fs = require('fs');
var cheerio = require('cheerio');
var subReddits = ['memes', 'wtf', 'images', 'gifs', 'pepe'];




function scrapeSubReddit(name, filename) {
  request('https://www.reddit.com/r/' + name, function(error, response, body) {
    if (!error) {

      var $ = cheerio.load(body);
      var links = [];
      var containsImgs = false;
      var index = 0;

      console.log(colors.gray('Scraping subreddit with name: ' + colors.cyan(name)));
      $('.thing a').each(function(i, elem) {
        var href = elem.attribs.href;
        var isImgLink = /http:\/\/i\.imgur\.com\/(.)*/;

        if (isImgLink.test(href)) {
          mkdirp('scrapes/' + name + '/', function(err) {
            if (err) console.log("RIP");
          });

          if(index % 2 === 0)
            links.push(href);

          containsImgs = true;
          index++;
        }
      });
      if (containsImgs) {
        console.log(colors.gray('Subreddit with name ') + colors.magenta(name) + colors.gray(' contains images, saving to disk...'));
        jsonfile.writeFileSync(filename, links);
      } else {

      }
    } else {
      console.log('Seems like something went wrong: ' + error + ', While trying to request subreddit with name: ' + name);
    }
  });
}



function scrape(subreddits) {
  var date = new Date();
  for (var i = 0; i < subreddits.length; i++) {
    (function(i) {
    setTimeout(function() {
      scrapeSubReddit(subreddits[i], 'scrapes/' + subreddits[i] + '/' + subreddits[i] + '-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '.json');
    }, i * 300);
  })(i);
  }
}


app.get('/api/:subreddit/:file', function(req, res) {
  var subreddit = req.params.subreddit;
  var file = req.params.file;
  res.sendFile(__dirname + '/scrapes/' + subreddit + '/' + file);
});



scrape(subReddits);

app.listen(4847);
