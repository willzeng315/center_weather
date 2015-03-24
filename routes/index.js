var express = require('express');
var http = require('http');
var debug = require('debug')('worker');
var router = express.Router();
var parseModel = require('../models/parseXML');
var cronModel = require('../models/myCron');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/startCron', function(req, res) {
    cronModel.startCron();
    res.render('index', {
        title: 'Start Cron Job!'
    });
});


router.get('/test/:xmlPath', function(req, res) {
    debug('xmlPath1111',+req.params.xmlPath);

    var options = {
        hostname: "www.cwb.gov.tw",
        path: '/rss/forecast/36_'+ req.params.xmlPath +'.xml'
    };

    http.get(options, function(response) {

        var completeResponse = '';
        response.on('data', function(chunk) {
            completeResponse += chunk;
        });

        response.on('end', function() {
            parseModel.parseTodayWeather(completeResponse, function(parseResult) {
                debug('Today Title = ' +parseResult.title);
                debug('Today Data = ' +parseResult.desc);

                parseModel.parseWeekWeather(completeResponse, function(parseWeekResult) {
                    //debug('Title = ' +parseWeekResult.title);
                    //debug('data = ' +parseWeekResult.desc);
                    res.json(parseWeekResult);
                });
            });

        });


    });
        
});

module.exports = router;