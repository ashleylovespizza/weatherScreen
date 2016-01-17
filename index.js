var http = require('http');
var moment= require('moment');

var options = {
  host: 'api.openweathermap.org',
  port: 80,
  path: '/data/2.5/weather?zip=02144,us&units=imperial&appid=ab79ecbc8bcff874f6ffac3416ac0dde',
  method: 'GET'
};

function getNewWeatherRequest() {
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var wdata = JSON.parse(chunk);

      console.log(wdata.main.temp+"°");
      console.log(wdata.weather[0].description);
      console.log(wdata.sys.sunrise+" sunrise in unix time");
      console.log(moment.unix(wdata.sys.sunset).format('MMMM Do YYYY, h:mm:ss a')+" sunset");
      console.log(wdata.sys.sunset+" sunset in unix time");
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write('data\n');
  req.write('data\n');
  req.end();
}

getNewWeatherRequest();
// every 15 minutes, get new weather
setInterval(getNewWeatherRequest, 1000*60*15);

var SerialPort = require("serialport").SerialPort


var sp = new SerialPort("/dev/ttyAMA0", {
  baudrate: 19200
});
sp.on("open", function() {
	console.log("serial open");
	sp.write("hello world", function(err, results) {
		console.log('err ' + err);
		console.log('results ' + results);
  	});
});
