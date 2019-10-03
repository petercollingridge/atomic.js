var world1 = Atomic.makeWorld('world-1', 300, 200);

document.getElementById('world-1-button').onclick = world1.toggleRunning;
document.getElementById('world-1-speed').onchange = function() {
    world1.set('simulationSpeed', parseInt(this.value));
};

world1.addParticles(20);
world1.draw();

var worldWidth2 = 400;
var worldHeight2 = 400;
var world2 = Atomic.makeWorld('world-2', worldWidth2, worldHeight2);
document.getElementById('world-2-button').onclick = world2.toggleRunning;

//  Set defaults
world2.set('particleR', 4);
world2.set('initialSpeed', 0.04);
world2.set('particleFill', 'rgb(220, 80, 30)');

// Add block of particles
world2.addParticleBlock(100, worldHeight2 - 36, 120, 40);

// Add a block of particles with different parameters
world2.addParticleBlock(120, worldHeight2 - 80, 80, 40, { colour: 'rgb(40, 60, 200)' });

world2.draw();
