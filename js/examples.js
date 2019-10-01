var world1 = Atomic.makeWorld('world-1', 300, 200);
world1.addParticles(20);
world1.draw();

var world2 = Atomic.makeWorld('world-2', 160, 160);
world2.set('particleR', 10);
world2.set('particleFill', 'red');
world2.addParticles(10);
world2.draw();
