


/************PROCESS DATA TO/FROM Client****************************/

	
var socket = io(); //load socket.io-client and connect to the host that serves the page
window.addEventListener("load", function(){ //when page loads
  var lightbox26 = document.getElementById("GPIO26");
  var lightbox20 = document.getElementById("GPIO20");
  var lightbox21 = document.getElementById("GPIO21");
  var lightbox16 = document.getElementById("GPIO16");

  // This processes GPIO26 events from the client's web browser
  lightbox26.addEventListener("click", function() { //add event listener for when checkbox changes
	  socket.emit("GPIO26", Number(this.checked)); // send GPIO button press to node.js server (as 1 or 0)
  });
	
  // This processes GPIO20 events from the client's web browser
  lightbox20.addEventListener("click", function() { //add event listener for when checkbox changes
	  socket.emit("GPIO20", Number(this.checked)); // send GPIO button press to node.js server (as 1 or 0)
  });
  
  // This processes GPIO21 events from the client's web browser
  lightbox21.addEventListener("click", function() { //add event listener for when checkbox changes
	  socket.emit("GPIO21", Number(this.checked)); // send GPIO button press to node.js server (as 1 or 0)
  });
  
    // This processes GPIO16 events from the client's web browser
  lightbox16.addEventListener("click", function() { //add event listener for when checkbox changes
	  socket.emit("GPIO16", Number(this.checked)); // send GPIO button press to node.js server (as 1 or 0)
  });

  if( isMobile.any() ) {
//    alert('Mobile');  
    document.addEventListener("touchstart", ReportTouchStart, false);
    document.addEventListener("touchend", ReportTouchEnd, false);
    document.addEventListener("touchmove", TouchMove, false);
  }else{
//    alert('Desktop');  
    document.addEventListener("mouseup", ReportMouseUp, false);
    document.addEventListener("mousedown", ReportMouseDown, false);
  }
  
});

//Update gpio feedback when server changes LED state
socket.on('GPIO26', function (data) {  
  console.log('GPIO26 function called');
  console.log(data);
  var myJSON = JSON.stringify(data);
  console.log(myJSON);
  document.getElementById('GPIO26').checked = data;
  console.log('GPIO26: '+data.toString());
});


//Update gpio feedback when server changes LED state
socket.on('GPIO20', function (data) {  
  console.log('GPIO20 function called');
  console.log(data);
  var myJSON = JSON.stringify(data);
  console.log(myJSON);
  document.getElementById('GPIO20').checked = data;
  console.log('GPIO20: '+data.toString());
});



//Update gpio feedback when server changes LED state
socket.on('GPIO21', function (data) {  
  console.log('GPIO21 function called');
  console.log(data);
  var myJSON = JSON.stringify(data);
  console.log(myJSON);
  document.getElementById('GPIO21').checked = data;
  console.log('GPIO21: '+data.toString());
});



//Update gpio feedback when server changes LED state
socket.on('GPIO16', function (data) {  
  console.log('GPIO16 function called');
  console.log(data);
  var myJSON = JSON.stringify(data);
  console.log(myJSON);
  document.getElementById('GPIO16').checked = data;
  console.log('GPIO16: '+data.toString());
});


function ReportTouchStart(e) {
  //e.preventDefault();  // this prevents the clipboard from popping up on iOS devices but also prevents zooming/scrolling
  if (e.target.className === 'range-slider') {
    console.log("volume class detected")
  } else if (e.target.id === "GPIO26M") {
    socket.emit("GPIO26", 1); 
    document.getElementById('GPIO26').checked = 1;
  } else if (e.target.id === "GPIO20M") {
    console.log("GPIO20 pressed");
    socket.emit("GPIO20", 1); 
    document.getElementById('GPIO20').checked = 1;
  } else if (e.target.id === "GPIO21M") {
    console.log("GPIO21 pressed");
    socket.emit("GPIO21", 1); 
    document.getElementById('GPIO21').checked = 1;
  } else if (e.target.id === "GPIO16M") {
    console.log("GPIO16 pressed");
    socket.emit("GPIO16", 1); 
    document.getElementById('GPIO16').checked = 1;
  }
}

function ReportTouchEnd(e) {
  if (e.target.className === 'range-slider') {
    console.log("volume class detected");
  } else if (e.target.id === "GPIO26M") {
    socket.emit("GPIO26", 0); 
    document.getElementById('GPIO26').checked = 0;
  } else if (e.target.id === "GPIO20M") {
    socket.emit("GPIO20", 0); 
    document.getElementById('GPIO20').checked = 0;
  } else if (e.target.id === "GPIO21M") {
    socket.emit("GPIO21", 0); 
    document.getElementById('GPIO21').checked = 0;
  } else if (e.target.id === "GPIO16M") {
    socket.emit("GPIO16", 0); 
    document.getElementById('GPIO16').checked = 0;
  }
}

function ReportMouseDown(e) {
  if (e.target.id === "GPIO26M") {
    console.log("GPIO26 pressed");
    socket.emit("GPIO26", 1); 
    document.getElementById('GPIO26').checked = 1;
  } else if (e.target.id === "GPIO20M") {
    console.log("GPIO20 pressed");
    socket.emit("GPIO20", 1); 
    document.getElementById('GPIO20').checked = 1;
  } else if (e.target.id === "GPIO21M") {
    console.log("GPIO21 pressed");
    socket.emit("GPIO21", 1); 
    document.getElementById('GPIO21').checked = 1;
  } else if (e.target.id === "GPIO16M") {
    console.log("GPIO16 pressed");
    socket.emit("GPIO16", 1); 
  }
}


function ReportMouseUp(e) {
  if (e.target.id === "GPIO26M") {
    socket.emit("GPIO26", 0); 
    document.getElementById('GPIO26').checked = 0;
  } else if (e.target.id === "GPIO20M") {
    socket.emit("GPIO20", 0); 
    document.getElementById('GPIO20').checked = 0;
  } else if (e.target.id === "GPIO21M") {
    socket.emit("GPIO21", 0); 
    document.getElementById('GPIO21').checked = 0;
  } else if (e.target.id === "GPIO16M") {
    socket.emit("GPIO16", 0); 
    document.getElementById('GPIO16').checked = 0;
  }
}

function TouchMove(e) {

}



/** function to sense if device is a mobile device ***/
// Reference: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser

var isMobile = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};


