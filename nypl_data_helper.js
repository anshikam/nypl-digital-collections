'use strict';

var _ = require('lodash');

var rp = require('request-promise');

var ENDPOINT = 'http://api.repo.nypl.org/api/v1/items/search?q=';

function NYPLDataHelper() { }

NYPLDataHelper.prototype.requestItemsSearch = function(query) {
	return this.getItems(query).then(

	    function(response) {

	      console.log('success - received response for ' + query);

	      return response.body;

	    }
	);
};

NYPLDataHelper.prototype.getItems = function(query) {
	var options = {

	    method: 'GET',

	    uri: ENDPOINT + query + '&publicDomainOnly=true',

	    resolveWithFullResponse: true,

	    json: true,

	    headers: { 
	    	"Authorization": "Token token=z0aksx913i47hsd2" 
	    },

	  };

	  return rp(options);
};

NYPLDataHelper.prototype.formatSearchResponse = function(response) {
	console.log('Query from response : ' + response.nyplAPI.request.search_text );
	var ssmlBreak = "<speak><break time='0.5s' /></speak>"
    var numResultString = _.template('I found ${numResults} items that match ${query}' + ssmlBreak)({

	    numResults: response.nyplAPI.response.numResults,

	    query: response.nyplAPI.request.search_text,

	});
    
	if (response.nyplAPI.response.result.length !== 0) {

        var firstFive = ""; 
        for(var i=0;i<5;++i){
	      firstFive += ssmlBreak		
	      
	      if(i == 4){
            firstFive += 'and'
	      }	

          firstFive += response.nyplAPI.response.result[i].title + ", which is a " + response.nyplAPI.response.result[i].typeOfResource;
		}

	    var template = _.template('These are the first five items. ${firstFiveString}. I have added a card to the Alexa app with more information with these results')({

	        firstFiveString: firstFive,

	    });

        return numResultString +  template;

	} else {

	    //no delay
	    return numResultString + 'Please try searching something else';
	}
};

NYPLDataHelper.prototype.cardResponse = function(response){
  return {
  	  // Correct API call for images
  	  smallImageUrl : "https://loc.gov/pictures/lcweb2/service/pnp/cph/3c00000/3c05000/3c05300/3c05379r.jpg",
      largeImageUrl : "https://loc.gov/pictures/lcweb2/service/pnp/cph/3c00000/3c05000/3c05300/3c05379r.jpg"
      //"https://images.nypl.org/index.php?id=1217236&t=w&download=1&suffix=510d47df-1f06-a3d9-e040-e00a18064a99.001"
  }
};


module.exports = NYPLDataHelper;