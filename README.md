# atomic.js
A Javascript library for building simple atomic simulations.

## Simple example

```
// Insert a 200 by 300 pixel canvas into the DOM element with id="world"
var world = Atomic.makeWorld('world', 300, 200);

// Add 20 particles
world.addParticles(20);

// Start the simulation
world.start();
```
