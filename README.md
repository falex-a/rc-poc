RC-poc
==============

* Node.js server exercise, poc for smartphone virtual RC for mobile robot. 
*   * will be at least partially rewritten for the embedded device, e.g. in Lua/micropython for NodeMCU, or C++ for MBED.
* Serves statically a simple page with joystick widget courtesy of Virtualjoystick.js 
* Serves REST interface to get the "joystick coordinates" back from client
* The Virtualjoystick.js is modified so that it transmits the coordinates to the REST API a few times a second...
