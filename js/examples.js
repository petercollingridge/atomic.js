var world1 = Atomic.makeWorld('world-1', 300, 200);

document.getElementById('world-1-button').onclick = world1.toggleRunning;
document.getElementById('world-1-speed').onchange = function() {
    world1.set('simulationSpeed', parseInt(this.value));
};

world1.addParticles(20);
world1.draw();

var world2 = Atomic.makeWorld('world-2', 160, 160);

//  Set defaults
world2.set('particleR', 9);
world2.set('particleFill', 'red');

// Add block of particles
world2.addParticleBlock(10, 120, 80, 40);

// Add a block of particles with different parameters
world2.addParticleBlock(37, 72, 80, 40, { colour: 'blue', 'r': 6 });

world2.draw();
