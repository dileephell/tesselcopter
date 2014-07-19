// helicopter.js
var _          = require('lodash');
var tessel     = require('tessel');
var accel      = require('accel-mma84').use(tessel.port['A']);
var accel2     = require('accel-mma84').use(tessel.port['D']);
var climatelib = require('climate-si7020');

var climate    = climatelib.use(tessel.port['A']);

var data = {
  h: 0,
  dh: 0, 
  x: 0,
  dx: 0,
  y: 0,
  dy: 0,
  z: 1,
  dz: 0,
};

var thrust = 0;

var turn = _.debounce(function(direction) {
  console.log(direction);
}, 500, { leading: true, trailing: false });

// var lift = _.debounce(function(magnitude) {
//   console.log('Going up by: ' + magnitude);
// }, 200, { leading: true, trailing: false });

var lift = function(magnitude) {
  if(magnitude > 0.3) {
    console.log('Going up by: ' + magnitude);
  }
};


climate.on('ready', function () {
  console.log('Connected to si7020');
  climate.setHeater(true, function() {
    console.log('heater turned on successfully');
  });

  // accel2.on('ready', function() {
  //   accel2.on('data', function() {

  //   });
  // });

  accel.on('ready', function(){
    console.log('Connected to Accel');

    accel.on('data', function(xyz){
      var x = parseFloat(xyz[0].toFixed(2));
      var y = parseFloat(xyz[1].toFixed(2));
      var z = parseFloat(xyz[2].toFixed(2));

      var dx = x - data.x;
      var dy = y - data.y;
      var dz = z - data.z;

      var thing = 0.5;
      if (dx > thing) {
        turn('right');
      } else if (dx < -thing) {
        turn('left');
      }

      thrust += dy;
      if ( thrust < 0 ) thrust = 0;

      lift(-y);

      data = _.extend(data, {
        x: x,
        y: y,
        z: z,
        dx: dx,
        dy: dy,
        dz: dz
      });

      climate.readHumidity(function(err, humid) {
        var h = humid.toFixed(2);
        h = parseFloat(h);
        data.dh = h - data.h;
        data.h = h;

        if (data.dh > 2) {
          console.log('ONWARD MY FALCON');
        } else if (data.dh < -2) {
          console.log('RETREAT MY PRECIOUS');
        }
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('error connection module', err);
});

accel.on('err', function(err){
  console.log('Error: ', err);
});
