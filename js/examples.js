var world1 = Atomic.makeWorld('world-1', 300, 200);
var button1 = document.getElementById('world-1-button');
button1.onclick = world1.toggleRunning;

world1.addParticles(20);
world1.draw();

var world2 = Atomic.makeWorld('world-2', 160, 160);
world2.set('particleR', 9);
world2.set('particleFill', 'red');
world2.addParticleBlock(10, 120, 80, 40);
world2.draw();
