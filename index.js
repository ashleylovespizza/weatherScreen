var http = require('http');
var moment= require('moment');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;


var line2 = "No Pants Island LLC";
var line3 = "";
var line4 = "";
// initialize weather in case nothin comes in
var screenStr = "";


function writeScreen(){
	// line 1
	screenStr = moment().format('dd MMM D YYYY HH:mm');
	// you know this will always come out to 20 chars
	
//	console.log("line2 - "+line2);
	line2 = line2.substring(0,20);
//	console.log("post concat - "+line2);
	var origlen = line2.length;
	for (var i=0; i<20-origlen; i++) {
	//	console.log("AD A SPACE YO")
		line2+=" ";
	}
	console.log("LINE2: "+line2.length)
	screenStr += line2;
//	screenStr = String(screenStr).substring(0,20);
	
	
	
	line3 = line3.substring(0,20);
	var origlen = line3.length;
	for (var i=0; i<20-origlen; i++) {
		line3+=" ";
	}
	screenStr += line3;
	// if it's more than 30 chars chop it
//	screenStr = String(screenStr).substring(0,30);
	
	
	line4 = line4.substring(0,19);
	var origlen = line4.length;
	for (var i=0; i<19-origlen; i++) {
		line4+=" ";
	}
	screenStr += line4;
	
	// if it's more than 40 chars chop it
	screenStr = String(screenStr).substring(0,79);
	
	// // pad out rest of screen if necessary
	// var diff = (20*4-5) - screenStr.length;
	// for (var i=0; i<diff; i++) {
	// 	screenStr += " ";
	// }
	
	console.log(screenStr)
	// clear screen
	sp.write("\001");
	sp.write(screenStr);
}

// ttyAMA0 is the port our serial screen lives on
var sp = new SerialPort("/dev/ttyAMA0", {
  baudrate: 19200,
  parser: serialport.parsers.readline("\n")
});

// api call to get some weather data for Somerville, MA
var current_weather_options = {
  host: 'api.openweathermap.org',
  port: 80,
  path: '/data/2.5/weather?zip=02144,us&units=imperial&appid=ab79ecbc8bcff874f6ffac3416ac0dde',
  method: 'GET'
};

// api call to get some weather data for Somerville, MA
var forecast_weather_options = {
  host: 'api.openweathermap.org',
  port: 80,
  path: '/data/2.5/forecast?zip=02144,us&units=imperial&appid=ab79ecbc8bcff874f6ffac3416ac0dde',
  method: 'GET'
};


// call this function every 15 minutes
function getNewWeatherRequest() {
  // make http request
  var req = http.request(current_weather_options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
console.log("utf8");


    res.on('data', function (chunk) {
      var wdata = JSON.parse(chunk);
      line2 = "";
//console.log(moment.unix(wdata.list[0].dt).format('MMMM Do YYYY, h:mm:sss a'));

     // first weather line - "36°F - light rain"
     var temp = (String(wdata.main.temp).split('.'))[0];
     line2 += temp+"F " + String(wdata.weather[0].description).substring(0,(20-2-temp.length));
	
    // line 3- wind or humidity
	var monthnum = Number(moment().format('M'));
	if (monthnum > 9 || monthnum < 5) {
		// wind chill
		var tempnum = Number(temp);
		var speednum = Number(wdata.wind.speed);
		var windchill = Math.round( 35.74 + (0.6215*tempnum) - 35.75*(Math.pow(speednum, 0.16)) + 0.4275*tempnum*(Math.pow(speednum, 0.16)));
		line3 = String(Math.round(speednum))+"mph winds- WC "+windchill+"F";
		
	} else {
		// humidity
		line3 = wdata.main.humidity+"% humidity";
	}

	// line 4 sunset, or somethin special
	// default - sunset time:
	switch (moment().format('MMDD')) {
	  case '0214':
	    line4="HB Charlie! <3"
	    break;
	  case '0201':
		line4="HUDSON YOU ARE OLDER";
	    break;
	  case '0907':
		line4="HB ASHWEE";
	    break;
	  case '0214':
		line4="HB ASHWEE";
	    break;
	  case '0202':
		line4="It's groundhog time.";
	    break;
	  case '0317':
		line4="Hi cha chai";
	    break;
	  case '0401':
		line4="April Fools.";
	    break;
	  case '0422':
		line4="Earth Day, you hippy";
	    break;
	  case '0508':
		line4="Call your mom!";
	    break;
	  case '0530':
		line4="Memorial Day!";
	    break;
	  case '0619':
		line4="Call your dad!";
	    break;
	  case '0704':
		line4="Hot Dog Contest";
	    break;
	  case '1106':
		line4="Fall Back";
	    break;
	  case '0313':
		line4="Spring forward";
	    break;
	  case '0313':
		line4="Spring forward";
	    break;
	  case '0801':
		line4="Charlie's Mom's Bday";
	    break;
	  case '1123':
		line4="Charlie's Dad's Bday";
	    break;
	  case '1102':
		line4="Ashley's Mom's Bday";
	    break;
	
	  case '0926':
		line4="Ashley's Dad's Bday";
	    break;
	
	  case '1003':
	    line4="Rika's Bday!";
	    break;
	  case '0511':
	    	line4="Ross's Bday!";
	        break;
	    
	  case '1021':
	     line4="Robbie's Bday!";
	     break;
	   
	  case '0628':
	   line4="Wiff's Bday!";
	   break;
	 
	  case '0227':
	   line4="BON ANNIVERSAIRE!!";
	   break;

	  case '1203':
		var years = Number(moment().format("YYYY")) - 2011;
	   line4="NPI turns "+years+" <3<3";
	   break;
	  default:
	    // dfault - sunset
		line4 = "Sun sets at "+moment.unix(wdata.sys.sunset).format('HH:mm');
	    break;
	}
		 
     console.log(wdata.main.temp+" F");
     console.log(wdata.weather[0].description);
    
     // second weather line - the day's hi and low and forecast
    
     console.log(wdata.sys.sunrise+" sunrise in unix time");
     console.log(moment.unix(wdata.sys.sunset).format('MMMM Do YYYY, h:mm:ss a')+" sunset");
     console.log(wdata.sys.sunset+" sunset in unix time");
	 if(sp && sp.isOpen()) {
	   
	     writeScreen();
	 }

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

// every 1 minute, get new weather
setInterval( writeScreen, 1000*20);

getNewWeatherRequest();
// every 15 minutes, get new weather
setInterval(getNewWeatherRequest, 1000*60*15);





sp.on("open", function() {
  console.log("serial open");
	writeScreen();
	
});
