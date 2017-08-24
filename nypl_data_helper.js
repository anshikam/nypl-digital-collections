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
    var numResultString = _.template('There are ${numResults} of items in the public domain matching ${query}.')({

	    numResults: response.nyplAPI.response.numResults,

	    query: response.nyplAPI.request.search_text,

	});
    
	if (response.nyplAPI.response.result.length !== 0) {

        var firstFive = ""; 
		for(var i=0;i<5;++i){
          firstFive += response.nyplAPI.response.result[i].title + " which is a " + response.nyplAPI.response.result[i].typeOfResource + ".";
		}

	    var template = _.template('These are the first five items. ${firstFiveString}')({

	        firstFiveString: firstFive,

	    });

        return numResultString +  template;

	} else {

	    //no delay
	    return numResultString + 'Please try searching something else.';
	}
};


module.exports = NYPLDataHelper;