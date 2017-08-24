'use strict';

var chai = require('chai');

var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;

var NYPLDataHelper = require('../nypl_data_helper');

chai.config.includeStack = true;
	

describe('NYPLDataHelper', function() {

  var subject = new NYPLDataHelper();

  var query;

  describe('#searchDigitalCollections', function() {

	context('with a valid search query', function() {

	  it('returns count of items that contain the query', function() {
	    var resultCount = '2550';
        query = "cars";

	    var value = subject.requestItemsSearch(query).then(function(obj) {

	      console.log(obj);		
	      return obj.nyplAPI.response.numResults;

	    });

	    return expect(value).to.eventually.eq(resultCount);

	  });

	});

	context('with an invalid search query', function() {
  
      it('returns 0 items count', function() {
        query = 'PUNKYWEBSTER';

        var value = subject.requestItemsSearch(query).then(function(obj) {
          console.log(obj);		
	      return obj.nyplAPI.response.numResults;

	    });
        
        return expect(value).to.eventually.eq('0');
      });

    });

 });

 //  describe( '#formatSearchResponse', function() {

 //    var status = {
	// 	"delay": "true",
	// 	"IATA": "HOU",
	// 	"state": "Texas",
	// 	"name": "Houston William P Hobby",
	// 	"weather": {
	// 		"visibility": 10,
	// 		"weather": "Mostly Cloudy",
	// 		"meta": {
	// 			"credit": "NOAA's National Weather Service",
	// 			"updated": "5:53 PM Local",
	// 			"url": "http://weather.gov/"
	// 		},
	// 		"temp": "90.0 F (32.2 C)",
	// 		"wind": "Southeast at 6.9mph"
	// 	},
	// 	"ICAO": "KHOU",
	// 	"city": "Houston",
	// 	"status": {
	// 		"reason": "AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY",
	// 		"closureBegin": "",
	// 		"endTime": "",
	// 		"minDelay": "",
	// 		"avgDelay": "57 minutes",
	// 		"maxDelay": "",
	// 		"closureEnd": "",
	// 		"trend": "",
	// 		"type": "Ground Delay"
	// 	}
	// };

	// context('with a status containing no delay', function() {

	//     it('formats the status as expected', function() {

	//         status.delay = 'false';

	//         expect(subject.formatAirportStatus(status)).to.eq('There is currently no delay at Houston William P Hobby. The current weather conditions are Mostly Cloudy, 90.0 F (32.2 C) and wind Southeast at 6.9mph.');

	//     });

	// });

	// context('with a status containing a delay', function() {

	//     it('formats the status as expected', function() {

	//         status.delay = 'true';

	//         expect(subject.formatAirportStatus(status)).to.eq('There is currently a delay for Houston William P Hobby. The average delay time is 57 minutes. Delay is because of the following: AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY. The current weather conditions are Mostly Cloudy, 90.0 F (32.2 C) and wind Southeast at 6.9mph.');

	//     });

 //    });


 //  });

});


