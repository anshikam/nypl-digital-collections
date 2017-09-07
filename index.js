'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('nypldc');
var NYPLDataHelper = require('./nypl_data_helper');

app.launch(function(req, res) {
  var prompt = 'Welcome to N Y P L Digital Collections. To start searching, say "Search for", followed by what you want to search. Example, if you are looking for stamps, say "Search for stamps"';
  res.card({
          type: "Simple",
          title: "Using NYPL Digital Collections",
          content: "Try saying: \n 'Search for stamps'"
  });
  res.directives();
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('nyplsearch', {
  'slots': {
    'KEYWORD': 'AMAZON.US_CITY'
  },
  'utterances': ['{query|search} {for} {-|KEYWORD}']
},
  function(req, res) {
    //get the slot
    var keyword = req.slot('KEYWORD');
    var reprompt = 'Is there anything else you want to search?';

    if (_.isEmpty(keyword)) {
      var prompt = 'I did not hear anything.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var nyplHelper = new NYPLDataHelper();
      return nyplHelper.requestItemsSearch(keyword).then(function(nyplResponse) {
        res.card({
          // type: "RichText",
          // text: 'Welcome to <b>My Dogru</b>'
          type: "Standard",
          title: "Search results for " + keyword, // this is not required for type Simple
          //Add actual five results with links
          text: 'The top five results for ' + keyword + ' are \n 1. [link](http://www.google.com/) <a href= \"http://www.google.com/\">Google</a>" \n 2. [link](http://www.jalopnik.com/) \n <a href=\"http://www.jalopnik.com/\">link2</a>" ',
          image: nyplHelper.cardResponse(nyplResponse)
        });
        res.say(nyplHelper.formatSearchResponse(nyplResponse)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for ' + keyword + '.';
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt + reprompt).shouldEndSession(false).send();
      });
      // return false;
    }
  }
);

// app.intent("AMAZON.HelpIntent",{
//   "slots": {},
//   "utterances": []
// }, function(request, response) {
//     var helpOutput = "You can say 'some statement' or ask 'some question'. You can also say stop or exit to quit.";
//     var reprompt = "What would you like to do?";
//     // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false) 
//     response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
//     return
// });
 
app.intent("AMAZON.StopIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
    var stopOutput = "Thanks for using N Y P L";
    response.say(stopOutput).shouldEndSession(true).send();
});
 
app.intent("AMAZON.CancelIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
    var cancelOutput = "Thanks for using N Y P L";
    response.say(cancelOutput).shouldEndSession(true).send();
});
//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;