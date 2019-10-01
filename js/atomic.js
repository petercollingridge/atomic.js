const Atomic = (() => {
    // Constants
    const TAU = 2 * Math.PI;

    // Functions
    const random = Math.random;

    let INITIAL_SPEED = 1;

    class Particle {
        constructor(x, y) {
            this.x = y;
            this.y = y;
            this.dx = (INITIAL_SPEED * random()) * Math.cos((TAU * random()));
            this.dy = (INITIAL_SPEED * random()) * Math.cos((TAU * random()));
        }
    }

    function makeWorld(id, width, height) {
        const parent = document.getElementById(id);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        parent.appendChild(canvas);

        var particles = [];

        function addParticles(n) {
            for (var i = 0; i < n; i++) {
                var x = width * random();
                var y = height * random();
                particles.push(new Particle(x, y));
            }
        };

        return {
            particles: particles,
            addParticles: addParticles,
        };
    }

    return {
        makeWorld: makeWorld
    };

})();