function statesOfMatterExamples(id, temperature) {
    var width = 330;
    var height = 330;

    var world = Atomic.makeWorld(id, width, height);

    world.set('simulationSpeed', 6);
    world.set('particleR', 3.5);
    world.set('temperature', temperature);

    // Add block of particles
    world.addParticleBlock(width * 0.25, 1, width * 0.25 - 4, 150, { temperature: temperature });
    world.addParticleBlock(width * 0.5, 1, width * 0.25, 150, { temperature: temperature, colour: '#d32' });

    // Add play pause button
    world.addPlayPauseButton(id + '-button');

    // Add restart button
    world.save();
    document.getElementById(id + '-restart-button').onclick = world.restart;

    world.initialDraw();
}

statesOfMatterExamples('solid', 0.02);
statesOfMatterExamples('liquid', 0.18);
statesOfMatterExamples('gas', 0.5);

(function(id){
    var width = 400;
    var height = 400;
    var world = Atomic.makeWorld(id, width, height);

    document.getElementById(id + '-button').onclick = world.toggleRunning;
    document.getElementById(id + '-temp').addEventListener('input',
        function() {
            world.set('temperature', parseFloat(this.value));
        }
    );
    

    //  Set defaults
    world.set('particleR', 4);
    world.set('initialSpeed', 0.001);
    world.set('temperature', 0);
    world.set('particleFill', 'rgb(220, 80, 30)');

    // Add block of particles
    world.addParticleBlock(80, 0, 80, 60);
    world.addParticleBlock(width - 160, 0, 80, 60);

    // Add a block of particles with different parameters
    world.addParticleBlock(100, 60, 200, 60, { colour: 'rgb(40, 60, 200)' });

    world.draw();
})('world-2');

(function(id){
    var width = 400;
    var height = 400;

    var world = Atomic.makeWorld(id, width, height);
    document.getElementById(id + '-button').onclick = world.toggleRunning;

    // Add water
    world.addParticleBlock(10, 0, 380, 60, { 'temperature': 0.25 });

    // Add a block of particles with different parameters
    world.addParticleBlock(120, 60, 85, 60, { colour: 'red', 'temperature': 0.01 });

    world.draw();
})('world-3');

(function(id){
    var width = 400;
    var height = 400;

    var world = Atomic.makeWorld(id, width, height);
    world.scale(0.5);
    document.getElementById(id + '-button').onclick = world.toggleRunning;

    // Add water
    world.addParticleBlock(10, 0, 380, 60, { 'temperature': 0.125 });

    // Add a block of particles with different parameters
    world.addParticleBlock(120, 60, 85, 60, { colour: 'red', 'temperature': 0.005 });

    world.draw();
})('world-4');

(function(id){
    var width = 200;
    var height = 400;
    var temperature = 0.12;

    var world = Atomic.makeWorld(id, width, height);
    // world.scale(0.8);
    world.set('gravity', 0);
    world.set('temperature', temperature);
    world.addPlayPauseButton(id + '-button');

    // Add water
    world.addParticleBlock(5, 0, width - 10, height - 40, { 'temperature': temperature });
    world.addParticleBlock(5, height - 36, width - 10, 36, { 'temperature': temperature, colour: 'red' });

    world.draw();
})('diffusion-1');

(function(id){
    var width = 200;
    var height = 400;
    var temperature = 0.2;

    var world = Atomic.makeWorld(id, width, height);
    // world.scale(0.8);
    world.set('gravity', 0);
    world.set('temperature', temperature);
    world.addPlayPauseButton(id + '-button');

    // Add water
    world.addParticleBlock(5, 0, width - 10, height - 40, { 'temperature': temperature });
    world.addParticleBlock(5, height - 36, width - 10, 36, { 'temperature': temperature, colour: 'red' });

    world.draw();
})('diffusion-2');