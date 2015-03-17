var parseString = require('xml2js').parseString;
var debug = require('debug')('worker');


var parseXMLAlgo = {};
module.exports = parseXMLAlgo;

function parseTodayWeather(completeResponse, fn) {
    parseString(completeResponse, function(err, result) {
        fn({
            title: result.rss.channel[0].item[0].title,
            desc: result.rss.channel[0].item[0].description
        });
    });
}

function parseWeekWeather(completeResponse, fn) {
    parseString(completeResponse, function(err, result) {
        var weekStr = result.rss.channel[0].item[1].description;
        debug(weekStr);
        var weekSplit = weekStr.toString().split('\n\t');
        var minTemp = [],
            maxTemp = [],
            wdate = [],
            dayWeather=[],
            nightWeather=[],
            i = 0,
            index,
            brIndex,
            spaceIndex,
            lastSpaceIndex,
            shift,
            startShift,
            endShift;
        if (weekSplit[1].indexOf('晚上') > 0) {
            shift = 0;
            startShift=1;
            endShift=3;
        } else {
            shift = 1;
            startShift=2;
            endShift=2;
        }
        i=i+startShift;
        for (len = weekSplit.length; i < len-endShift; i++) {

            index = weekSplit[i].indexOf('~');
            brIndex = weekSplit[i].indexOf('<BR>');
            lastSpaceIndex=weekSplit[i].lastIndexOf(' ');
            var desc=weekSplit[i].substring(index + 4, brIndex).trim();
            if ((i + shift) % 2 == 0) {
                debug(weekSplit[i]);
                
                spaceIndex = weekSplit[i].indexOf(' ');
                if(weekSplit[i].indexOf('晚上') > 0){
                    nightWeather.push(weekSplit[i].substring(lastSpaceIndex, brIndex).trim());
                }else{
                    dayWeather.push(weekSplit[i].substring(lastSpaceIndex, brIndex).trim());
                }
                debug('WEATHER= '+weekSplit[i].substring(lastSpaceIndex, brIndex).trim());
                wdate.push(weekSplit[i].substring(0, spaceIndex).trim());
                if(parseInt(weekSplit[i].substring(index - 3, index).trim()) > 
                    parseInt(weekSplit[i-1].substring(index - 3, index).trim())){
                    minTemp.push({y:parseInt(weekSplit[i-1].substring(index - 3, index).trim()),wDesc:desc});
                }else{
                    minTemp.push({y:parseInt(weekSplit[i].substring(index - 3, index).trim()),wDesc:desc});
                }

            } else {
                debug(weekSplit[i]);
                debug('WEATHER= '+weekSplit[i].substring(lastSpaceIndex, brIndex).trim());
                if(weekSplit[i].indexOf('晚上') > 0){
                    nightWeather.push(weekSplit[i].substring(lastSpaceIndex, brIndex).trim());
                }else{
                    dayWeather.push(weekSplit[i].substring(lastSpaceIndex, brIndex).trim());
                }
                if(parseInt(weekSplit[i].substring(index + 1, index + 4).trim())
                    >parseInt(weekSplit[i+1].substring(index + 1, index + 4).trim())){
                    maxTemp.push({y:parseInt(weekSplit[i].substring(index + 1, index + 4).trim()),wDesc:desc});
                }else{
                    maxTemp.push({y:parseInt(weekSplit[i+1].substring(index + 1, index + 4).trim()),wDesc:desc});
                }

            }
        }
        fn({
            title: result.rss.channel[0].item[1].title,
            desc: {
                maxTemp: maxTemp,
                minTemp: minTemp,
                wDate:wdate,
                nightWeather:nightWeather,
                dayWeather:dayWeather

            }
        });
    });
}

parseXMLAlgo.parseTodayWeather = parseTodayWeather;
parseXMLAlgo.parseWeekWeather = parseWeekWeather;