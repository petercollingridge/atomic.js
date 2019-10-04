var world1 = Atomic.makeWorld('world-1', 300, 200);

document.getElementById('world-1-button').onclick = world1.toggleRunning;
document.getElementById('world-1-speed').onchange = function() {
    world1.set('simulationSpeed', parseFloat(this.value));
};

world1.addParticles(20);
world1.draw();

var worldWidth2 = 400;
var worldHeight2 = 400;
var world2 = Atomic.makeWorld('world-2', worldWidth2, worldHeight2);
document.getElementById('world-2-button').onclick = world2.toggleRunning;
document.getElementById('world-2-temp').addEventListener('input',
    function() {
        world2.set('temperature', parseFloat(this.value));
    }
);

//  Set defaults
world2.set('particleR', 4);
world2.set('initialSpeed', 0.001);
world2.set('temperature', 0);
world2.set('particleFill', 'rgb(220, 80, 30)');

// Add block of particles
world2.addParticleBlock(80, worldHeight2 - 56, 80, 60);
world2.addParticleBlock(worldWidth2 - 160, worldHeight2 - 56, 80, 60);

// Add a block of particles with different parameters
world2.addParticleBlock(100, worldHeight2 - 106, 200, 50, { colour: 'rgb(40, 60, 200)' });

world2.draw();


var world3 = Atomic.makeWorld('world-3', worldWidth2, worldHeight2);
document.getElementById('world-3-button').onclick = world3.toggleRunning;

// Add water
world3.addParticleBlock(10, worldHeight2 - 60, 380, 60, { 'temperature': 0.25 });

// Add a block of particles with different parameters
world3.addParticleBlock(120, worldHeight2 - 128, 85, 60, { colour: 'red', 'temperature': 0.01 });

world3.draw();