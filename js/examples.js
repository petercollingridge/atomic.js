(function(id){
    var width = 200;
    var height = 200;

    var world = Atomic.makeWorld(id, width, height);
    document.getElementById(id + '-button').onclick = world.toggleRunning;

    world.set('particleR', 4);
    world.set('temperature', 0.01);

    // Add block of particles
    world.addParticleBlock(40, height - 120, width - 80, 120, { temperature: 0.01 });

    world.update();
})('solid');

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
    world.addParticleBlock(80, height - 56, 80, 60);
    world.addParticleBlock(width - 160, height - 56, 80, 60);

    // Add a block of particles with different parameters
    world.addParticleBlock(100, height - 106, 200, 50, { colour: 'rgb(40, 60, 200)' });

    world.draw();
})('world-2');

(function(id){
    var width = 400;
    var height = 400;

    var world = Atomic.makeWorld(id, width, height);
    document.getElementById(id + '-button').onclick = world.toggleRunning;

    // Add water
    world.addParticleBlock(10, height - 60, 380, 60, { 'temperature': 0.25 });

    // Add a block of particles with different parameters
    world.addParticleBlock(120, height - 128, 85, 60, { colour: 'red', 'temperature': 0.01 });

    world.draw();
})('world-3');