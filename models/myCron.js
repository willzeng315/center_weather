var CronJob = require('cron').CronJob;

var weatherCron={};
module.exports = weatherCron;

function startCron(){

	var job = new CronJob({
  cronTime: '* * * * * *',
  onTick: function() {
    console.log('123123123');
  }});
    job.start();

}

weatherCron.startCron=startCron;