var tessel = require('tessel');
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port['A']);
var controls = require('./stream.js');

var signal = new Buffer(controls.min);

var danceMoves = [new Buffer(controls.min), new Buffer(controls.maxForward), new Buffer(controls.maxLeft), new Buffer(controls.maxRight)];

// When we're connected
infrared.on('ready', function(err) {
  if (!err) {
    console.log("Connected to IR!");
  }
});

function transmitContinuously(buffer){
  // Send the signal at 38 kHz forever until it errors out
  infrared.sendRawSignal(38, buffer, function(err) {
    if (err) {
      console.log("Unable to send signal: ", err);
    } else {
      transmitContinuously(signal);
    }
  });
}

var fired = false;
infrared.on('data', function(data) {

  if(!fired){
    fired = true;
    console.log(data.toJSON());
    signal = new Buffer(data.toJSON());
    transmitContinuously(signal);
  }

});

// transmitContinuously(signal);



// setTimeout(function(){
//   signal = danceMoves[Math.floor(Math.random()*danceMoves.length)];
// }, 1000);

