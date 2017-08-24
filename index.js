'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('nypldc');
var NYPLDataHelper = require('./nypl_data_helper');

app.launch(function(req, res) {
  var prompt = 'For digital collections, tell me what are you looking for.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('nyplsearch', {
  'slots': {
    'KEYWORD': 'AMAZON.US_CITY'
  },
  'utterances': ['{query|search} {nypl digital collections for} {-|KEYWORD}']
},
  function(req, res) {
    //get the slot
    var keyword = req.slot('KEYWORD');
    var reprompt = 'Tell me what are you looking for.';
    if (_.isEmpty(keyword)) {
      var prompt = 'I didn\'t hear anything. Tell me a what are you looking for.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var nyplHelper = new NYPLDataHelper();
      return nyplHelper.requestItemsSearch(keyword).then(function(nyplResponse) {
        var reprompt = "Do you want me to send the image card for an item to your phone?"
        res.say(nyplHelper.formatSearchResponse(nyplResponse)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for ' + keyword;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      // return false;
    }
  }
);
//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;