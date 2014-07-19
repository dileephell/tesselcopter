# tesselcopter
##### the wind beneath your wings

If you came here for a reasonable and precise way to pilot a helicopter, stop now and go elsewhere. If you're down for some rip-roarin', high-flyin', humidity-breathin 'copter chaos, read on and enjoy.

This project allows control of an infrared-controlled toy helicopter via hand gestures and, of all things, humidity.

### Modules Required

- Accelerometer (x2)
- Climate
- Infrared (IR)


### Additional Supplies Needed

- [Syma S109G 3.5 Channel RC Helicopter with Gyro](http://www.amazon.com/Syma-S109G-Channel-Helicopter-Gyro/dp/B00DPK11XM/ref=sr_1_1?ie=UTF8&qid=1405813417&sr=8-1&keywords=s109+helicopter)


### Controls

- Lift: Tilt forward and backwards.
- Yaw: Quick tilt left and right.
- Forward: "Humidity increase" (breathe on sensor)
- Reverse: "Humidity decrease" (suck in quickly over the sensor to dry it)


### Setup

There are two distinct hardware parts to this operation: the Tessel (with modules) and the helicopter. The Tessel portion and related code is likely to be a fairly stable, plug-and-play operation if you're setting this up for the first time. The helicopter, on the other hand, may be more unreliable, as there's no guarantee that every model will use the same IR command codes.

First, layout your Tessel in the following way:
A: Acceleromter
B: Climate
C: IR
D: Accelerometer

Start the program with `tessel run tesselcopter.js`


### How It Works

Command input comes from the accelerometer and climate modules, is interpreted on the Tessel main board, and the output used to send signals from the IR module to the IR reciever on the chopper.

Each command sent to the helicopter is in fact a series of buffer data communicated by rapid flashing of the IR transmitter. Because the patterns required for each command (turn right, go up, etc.) have been arbitrarily set by the helicopter designer, and reverse engineering them is fairly tricky, we settled on recording known observable patterns from the controller that came with the helicopter then playing those back from the IR transmitter. If you have a lazy Sunday afternoon (or several), a bit of research into the exact command codes could take the precision of the helicopter control to the next level.

Because of the constraint on the complexity of number of command codes known for the helicopter, the accelerometer and humidity data is interpreted into a few simple commands before being sent to the helicopter. Accelerometer data is extremely noisy, with the slightest wiggle yielding numeric chaos, so we set thresholds on what's considered a real command action, and [debounced](http://lodash.com/docs#debounce) calls to the IR api.

Humidity values move more gradually between values than accelerometer data, but have a tendency to creep slowly upwards and downwards with use and disuse, so we also set a threshold here. As a result, only a good waft of moist air of sharp cooling suck issues an actual command to the helicopter.

Because the accelerometer modules are located off center relative to a "pilot" holding the Tessel in hand, we found that using two of them, one for "left" commands and one for "right," yielded the greatest accuracy.
