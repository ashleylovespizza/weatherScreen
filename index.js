var http = require('http');
var moment= require('moment');
var SerialPort = require("serialport").SerialPort;



var weatherStr = "No Pants Island LLC\n \n ";

// initialize weather in case nothin comes in
var screenStr = "";


function screenStr() {
  // first line - date
  screenStr = moment().format('dd MMM D YYYY HH:mm');

  screenStr += "\n" + weatherStr;
}

// initialize weather in case nothin comes in
//screenStr();



// ttyAMA0 is the port our serial screen lives on
var sp = new SerialPort("/dev/ttyAMA0", {
  baudrate: 19200
});

// api call to get some weather data for Somerville, MA
var http_options = {
  host: 'api.openweathermap.org',
  port: 80,
  path: '/data/2.5/weather?zip=02144,us&units=imperial&appid=ab79ecbc8bcff874f6ffac3416ac0dde',
  method: 'GET'
};

// call this function every 15 minutes
function getNewWeatherRequest() {
  // make http request
  var req = http.request(http_options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var wdata = JSON.parse(chunk);
      weatherStr = "";

      // first weather line - "36°F - light rain"
      var temp = (String(wdata.main.temp).split('.'))[0];
      weatherStr += temp+"° - " + wdata.weather[0].description;

      // TEMP let's just see if this works
      weatherStr += "\n line 3 \n line 4";
      console.log(wdata.main.temp+"°");
      console.log(wdata.weather[0].description);

      // second weather line - the day's hi and low and forecast

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


  if (sp.isOpen()) {
  //  screenStr()
    
  screenStr = moment().format("dd MMM D YYYY HH:mm");
console.log("MOMENT: "+moment().format("dd MMM D YYYY HH:mm"));
  screenStr += "\n" + weatherStr;

sp.write(screenStr, function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
  } else {
    sp.open();
  }

}

getNewWeatherRequest();
// every 15 minutes, get new weather
setInterval(getNewWeatherRequest, 1000*60*15);



sp.on("open", function() {
  console.log("serial open");
//  screenStr();
  screenStr = moment().format('dd MMM D YYYY HH:mm');
  screenStr += "\n" + weatherStr;
  
sp.write(screenStr, function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
    });
});
