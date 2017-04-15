
Playing around with smartphones-controlled toy car
===============================

* **Backend** - built using Node.js.  Employs 4 interfaces:
* * *Statically* served html,js for the smartphone controllers (see "Frontend" below)
* * *REST* interface for the controllers to transmit command and get status
* * *UDP listener* to have the robot identify itself so we know its IP. 
* * *UDP client*, periodically transmits Vx,Vy command of the active controller to the robot once it identified..
* **Frontend** - is based on [Virtualjoystick by Alexandra and Jerome Etienne]("http://learningthreejs.com/blog/2011/12/26/let-s-make-a-3d-game-virtual-joystick/"), 
* * adding periodic AJAX query against the server REST 
* * Query transmits current X,Y (or rather Vx,Vy) command and receives game state 
* * Screen is switched according to the state (e.g. enabled/disabled..)
* **Hardware & Firmware** - Lua on NodeMCU, see (https://github.com/falex-a/nodemcu-udp2pwm).
* **Multiplayer game functionality** - 
* * Game 1 (**WORKING**) : _*"Real-time Shootout"*_: control is switched between active smartphones every few seconds, so players take turns; Each player got to  move robot through opponent's 'goalpost'.
* * Game 2 (planned) : _*"Bowling"*_- taking actual turns, each player takes control then releases it and car continues for a few seconds with the last command; it has to take down stakeposts but without getting to the wall behind..
