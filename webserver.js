var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var url = require('url');
var path = require('path');
var io = require('socket.io','net')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED26 = new Gpio(26, 'out'); //use GPIO pin 26 as output
var LED20 = new Gpio(20, 'out'); //use GPIO pin 26 as output
var LED21 = new Gpio(21, 'out'); //use GPIO pin 26 as output
var LED16 = new Gpio(16, 'out'); //use GPIO pin 26 as output

var pushButton = new Gpio(19, 'in', 'both'); //Connect switch between GPIO19 and +3.3V.
//This will handle 'both' button presses, and releases should be handled

var GPIO26value = 1;  // Turn on the LED by default
var GPIO20value = 1;  // Turn on the LED by default
var GPIO21value = 1;  // Turn on the LED by default
var GPIO16value = 1;  // Turn on the LED by default

/****** CONSTANTS******************************************************/

const WebPort = 80;


/* if you want to run WebPort on a port lower than 1024 without running
 * node as root, you need to run following from a terminal on the pi
 * sudo apt update
 * sudo apt install libcap2-bin
 * sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
 */
 
/*************** Web Browser Communication ****************************/



// Start http webserver
http.listen(WebPort, function() {  // This gets call when the web server is first started.
	LED26.writeSync(GPIO26value); //turn LED on or off
	LED20.writeSync(GPIO20value); //turn LED on or off
	LED21.writeSync(GPIO21value); //turn LED on or off
	LED16.writeSync(GPIO16value); //turn LED on or off
	console.log('Server running on Port '+WebPort);
	console.log('LED state is '+GPIO26value);
	} 
); 



// function handler is called whenever a client makes an http request to the server
// such as requesting a web page.
function handler (req, res) { 
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    console.log('filename='+filename);
    var extname = path.extname(filename);
    if (filename=='./') {
      console.log('retrieving default index.html file');
      filename= './index.html';
    }
    
    // Initial content type
    var contentType = 'text/html';
    
    // Check ext and set content type
    switch(extname) {
	case '.js':
	    contentType = 'text/javascript';
	    break;
	case '.css':
	    contentType = 'text/css';
	    break;
	case '.json':
	    contentType = 'application/json';
	    break;
	case '.png':
	    contentType = 'image/png';
	    break;
	case '.jpg':
	    contentType = 'image/jpg';
	    break;
	case '.ico':
	    contentType = 'image/png';
	    break;
    }
    

    
    fs.readFile(__dirname + '/public/' + filename, function(err, content) {
	if(err) {
	    console.log('File not found. Filename='+filename);
	    fs.readFile(__dirname + '/public/404.html', function(err, content) {
		res.writeHead(200, {'Content-Type': 'text/html'}); 
		return res.end(content,'utf'); //display 404 on error
	    });
	}
	else {
	    // Success
	    res.writeHead(200, {'Content-Type': contentType}); 
	    return res.end(content,'utf8');
	}
      
    });
}


// Execute this when web server is terminated
process.on('SIGINT', function () { //on ctrl+c
  LED26.writeSync(0); // Turn LED off
  LED26.unexport(); // Unexport LED GPIO to free resources
  
  LED20.writeSync(0); // Turn LED off
  LED20.unexport(); // Unexport LED GPIO to free resources
  
  LED21.writeSync(0); // Turn LED off
  LED21.unexport(); // Unexport LED GPIO to free resources
  
  LED16.writeSync(0); // Turn LED off
  LED16.unexport(); // Unexport LED GPIO to free resources
  
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
}); 


/****** io.socket is the websocket connection to the client's browser********/

io.sockets.on('connection', function (socket) {// WebSocket Connection
    console.log('A new client has connectioned. Send LED status value='+GPIO26value);
    socket.emit('GPIO26', GPIO26value);
    socket.emit('GPIO20', GPIO20value);
    socket.emit('GPIO21', GPIO21value);
    socket.emit('GPIO16', GPIO16value);

    
    // this gets called whenever client presses GPIO26 light button
    socket.on('GPIO26', function(data) { 
	GPIO26value = data;
	if (GPIO26value != LED26.readSync()) { //only change LED if status has changed
	    LED26.writeSync(GPIO26value); //turn LED on or off
	    console.log('Send new GPIO26 state to ALL clients');
	    io.emit('GPIO26', GPIO26value); //send button status to ALL clients -- added by Steve
	};
	

    });
    
    // this gets called whenever client presses GPIO20 light button
    socket.on('GPIO20', function(data) { 
	GPIO20value = data;
	if (GPIO20value != LED20.readSync()) { //only change LED if status has changed
	    LED20.writeSync(GPIO20value); //turn LED on or off
	    console.log('Send new GPIO20 state to ALL clients');
	    io.emit('GPIO20', GPIO20value); //send button status to ALL clients -- added by Steve
	};

    });
    
    // this gets called whenever client presses GPIO21 light button
    socket.on('GPIO21', function(data) { 
	GPIO21value = data;
	if (GPIO21value != LED21.readSync()) { //only change LED if status has changed
	    LED21.writeSync(GPIO21value); //turn LED on or off
	    console.log('Send new GPIO21 state to ALL clients');
	    io.emit('GPIO21', GPIO21value); //send button status to ALL clients -- added by Steve
	};

    });
    
    // this gets called whenever client presses GPIO16 light button
    socket.on('GPIO16', function(data) { 
	GPIO16value = data;
	if (GPIO16value != LED16.readSync()) { //only change LED if status has changed
	    LED16.writeSync(GPIO16value); //turn LED on or off
	    console.log('Send new GPIO16 state to ALL clients');
	    io.emit('GPIO16', GPIO16value); //send button status to ALL clients -- added by Steve
	};
	
    });
 
 


    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
	console.log('A user disconnected');
    });
    
    //function SendToBrowser(data) {
	//socket.emit(data);
    //}
}); 


 


/**This code processes the switch connected to the Pi's GPIO pins**/
/** Connect switch between GPIO 19 and +3.3VDC.**/
pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    console.log('The Pi hardbutton button pressed,send Hard button status to clients');
    GPIO26value = value;
    
    // This updates clients if hard button is pressed
    LED.writeSync(GPIO26value); //turn LED on or off
    io.emit('GPIO26', GPIO26value); //send button status to client
    //console.log('GPIO26', GPIO26value);
});

