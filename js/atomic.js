var Atomic = (function () {
    // Constants
    var TAU = 2 * Math.PI;

    // Functions
    var min = Math.min;
    var max = Math.max;
    var sqrt = Math.sqrt;
    var floor = Math.floor;
    var random = Math.random;

    // Default config
    var SIMULATION_SPEED = 4;
    var GRAVITY = 0.0001
    var INITIAL_SPEED = 1;
    var TEMPERATURE = 0.2;

    var PARTICLE_FILL = 'rgb(100, 120, 200)';
    var PARTICLE_R = 5;

    var BOND_LIMIT = 18;
    var BOND_LENGTH = 12;
    var BOND_STRENGTH = 0.003;

    function getParticle(x, y, r, colour, speed) {
        var angle = TAU * random();

        return {
            x: x,
            y: y,
            r: r,
            dx: speed * Math.cos(angle),
            dy: speed * Math.cos(angle),
            colour: colour
        };
    };

    function makeWorld(id, width, height) {
        var parent = document.getElementById(id);
        if (!parent) {
            throw new Error('Canvas ' + id + ' not found');
        }

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;
        parent.appendChild(canvas);

        var particles = [];
        var savedParticles = [];
        var edges = [];
        var findEdges;
        var nParticles = 0;
        var animationId = false;

        var binSize, binRows, binCols, nBins;
        var bondDiff, bondLimitSq;

        // Initial world config
        var config = {
            particleFill: PARTICLE_FILL,
            particleR: PARTICLE_R,
            initialSpeed: INITIAL_SPEED,
            bondLimit: BOND_LIMIT,
            bondLength: BOND_LENGTH,
            bondStrength: BOND_STRENGTH,
            gravity: GRAVITY,
            temperature: TEMPERATURE,
            simulationSpeed: SIMULATION_SPEED,
            drawEdges: true,
            edgeColour: '#888',
        };
        _setBondLimit(BOND_LIMIT)

        function set(attr, value) {
            if (attr === 'bondLimit') {
                _setBondLimit(value);
            } else {
                config[attr] = value;
            }
        }

        function scale(scaleAmount) {
            // Increase or reduce the size of the simulation
            config.bondLength *= scaleAmount;
            _setBondLimit(scaleAmount * config.bondLimit);
            config.particleR *= scaleAmount;
            config.initialSpeed *= scaleAmount;
            // config.bondStrength *= scaleAmount;
            config.gravity *= scaleAmount;
            config.temperature *= scaleAmount;
        }

        function _setBondLimit(size) {
            config.bondLimit = size;
            bondLimitSq = size * size;
            bondDiff = config.bondLimit - config.bondLength;
            
            // Set bin size to bond limit length
            binSize = max(config.bondLimit, size);
            binRows = Math.ceil(width / size);
            binCols = Math.ceil(height / size);
            nBins = binRows * binCols;
        }

        function _addParticles(positions, params) {
            if (!params) { params = {}; }
            
            var r = params.r || config.particleR;
            var colour = params.colour || config.particleFill;
            var maxSpeed = params.temperature || config.initialSpeed;

            var n = positions.length;
            for (var i = 0; i < n; i++) {
                var x = positions[i][0];
                var y = positions[i][1];
                var speed = random() * maxSpeed;
                particles.push(getParticle(x, y, r, colour, speed));
            }

            nParticles += n;
        };

        function addParticles(n, params) {
            // Generate random positions
            var positions = [];
            for (var i = 0; i < n; i++) {
                positions.push([width * random(), height * random()]);
            }
            _addParticles(positions, params);
        };

        function addOrderedBlock(x1, y1, w, h, params) {
            if (!params) { params = {}; }
            var r = params.r || config.particleR;

            // Make sure values are within bounds
            x1 = max(0, x1);
            y1 = height - max(0, y1) - r;
            w = max(0, w);
            h = max(0, h);
            var x2 = min(width - r, x1 + w);
            var y2 = max(0, y1 - h + r);

            var positions = [];
            var x = x1;
            var y = y1;
            var dx = config.bondLength;
            var dy = dx * sqrt(3) / 2;
            var rows = 0;

            while (y > y2) {
                positions.push([x, y]);
                x += dx;
                if (x > x2) {
                    y -= dy;
                    x = x1;
                    rows++;
                    if (rows % 2) {
                        x += dx * 0.5;
                    }
                }
            }

            _addParticles(positions, params);
        }

        function addDisorderedBlock(x1, y1, w, h, density, params) {
            if (!density) {
                density = 1;
            } else if (density <= 0) {
                return;
            } else if (density > 2) {
                density = 2;
            } else if (isNaN(density)) {
                throw new Error('Density must be a number');
            }

            if (!params) { params = {}; }
            var r = params.r || config.particleR;

            // Make sure values are within bounds
            x1 = max(0, x1);
            y1 = height - max(0, y1) - r;
            w = max(0, w);
            h = max(0, h);
            var x2 = min(width - r, x1 + w);
            var y2 = max(0, y1 - h + r);

            // How many points we try before rejecting a point
            var k = 30;

            // Use min dist of two thirds bond length of average distance equals bond length
            var minDist = config.bondLength * 2 / 3 * density;
            var minDist2 = minDist * minDist;

            var positions = [];
            var activePoints = [];

            // Start at a random point near the center
            var x = x1 + (0.4 + random() * 0.2) * w;
            var y = y2 + (0.4 + random() * 0.2) * h;
            positions.push([x, y]);
            activePoints.push([x, y]);

            var i, j, activeIndex, currentPoint, pointAdded, angle, collision;
            while (activePoints.length) {
                // Pick a random active point
                activeIndex = floor(random() * activePoints.length);
                currentPoint = activePoints[activeIndex];
                pointAdded = false;

                for (i = 0; i < k; i++) {
                    angle = random() * TAU;
                    d = minDist + random() * minDist;
                    x = currentPoint[0] + Math.cos(angle) * d;
                    y = currentPoint[1] + Math.sin(angle) * d;
                    
                    if (x < x1 || x > x2 || y < y2 || y > y1) {
                        continue;
                    }

                    // Check distance from each other point is > minDist
                    collision = false;
                    for (j = positions.length; j--;) {
                        p = positions[j];
                        if ((x - p[0]) * (x - p[0]) + (y - p[1]) * (y - p[1]) < minDist2) {
                            collision = true;
                            break;
                        }
                    }

                    if (!collision) {
                        positions.push([x, y]);
                        activePoints.push([x, y]);
                        pointAdded = true;
                        break;
                    }
                }

                // Failed to add point so remove it from the active list
                if (!pointAdded) {
                    activePoints.splice(activeIndex, 1);
                }
            }

            _addParticles(positions, params);
        }

        function start() {
            update();
            animationId = window.requestAnimationFrame(start);
        }

        function stop() {
            if (animationId) {
                window.cancelAnimationFrame(animationId);
                animationId = false;
            }
        }

        function toggleRunning() {
            if (animationId) {
                stop();
            } else {
                start();
            }
        }

        function addPlayPauseButton(id) {
            document.getElementById(id).onclick = function() {
                toggleRunning();
                if (isRunning()) {
                    this.innerHTML = 'Pause';
                } else {
                    this.innerHTML = 'Play';
                }
            };
        }

        function isRunning() {
            return animationId !== false;
        }

        function copyParticles(particleArray) {
            var copy = [];
            for (var i = 0; i < nParticles; i++) {
                var particle = particleArray[i];
                var particleCopy = {};

                for (var attr in particle) {
                    particleCopy[attr] = particle[attr];
                }

                copy.push(particleCopy);
            }
            return copy;
        }

        function saveState() {
            savedParticles = copyParticles(particles);
        }

        function restoreState() {
            particles = copyParticles(savedParticles);
            initialDraw();
        }

        function update() {
            edges = [];
            findEdges = false;

            var count = config.simulationSpeed;
            while (count-- > 0) {
                // In the final update find which particles interact
                if (count === 0) {
                    findEdges = true;
                }
                tick();
            }
            draw();
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            
            if (config.drawEdges) {
                ctx.strokeStyle = config.edgeColour;
                for (var i = 0; i < edges.length; i++) {
                    var p1 = edges[i][0];
                    var p2 = edges[i][1];
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            for (var i = 0; i < nParticles; i++) {
                var p = particles[i];
                ctx.fillStyle = p.colour;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, TAU, true);
                ctx.fill();
            }
        }

        function initialDraw() {
            // Find edges and draw but don't move anything
            edges = [];
            findEdges = true;
            _calculateInteractions();
            draw();
        }

        function tick() {
            _calculateInteractions();

            // Particles move
            for (var i = 0; i < nParticles; i++) {
                p = particles[i];
                p.dy += config.gravity;
                p.x += p.dx;
                p.y += p.dy;

                // Particles bounce
                if (p.x < p.r) {
                    p.x = 2 * p.r - p.x;
                    p.dx *= _getEnergyExchangedWithWall(p);
                } else if (p.x > width - p.r) {
                    p.x = 2 * (width - p.r) - p.x;
                    p.dx *= _getEnergyExchangedWithWall(p);
                }
                if (p.y < p.r) {
                    p.y = 2 * p.r - p.y;
                    p.dy *= _getEnergyExchangedWithWall(p);
                } else if (p.y > height - p.r) {
                    p.y = 2 * (height - p.r) - p.y;
                    p.dy *= _getEnergyExchangedWithWall(p);
                }
            }
        }

        function _getEnergyExchangedWithWall(p) {
            var temp = sqrt(p.dx * p.dx + p.dy * p.dy);
            return -(temp + config.temperature) / (2 * temp);
        }

        function _calculateInteractions() {
            var bins = _getBinnedParticles();
            var x, y, i, j, k, p, pn;

            for (x = 0; x < binRows; x++) {
                for (y = 0; y < binCols; y++) {
                    i = x + y * binRows;
                    p = bins[i];
                    pn = p.length;
                    
                    // Empty bin, so keep moving
                    if (!pn) { continue; }
                    
                    // Find collisions within this bin
                    for (j = 0; j < pn - 1; j++) {
                        for (k = j + 1; k < pn; k++) {
                            _particleInteraction(p[j], p[k]);
                        }
                    }

                    // Find collisions with neighbouring bins
            
                    if (x < binRows - 1) {
                        // Collide with particles in the bin to the right
                        _interactionsBetweenBins(p, bins[i + 1]);
                    }

                    if (y < binCols - 1) {
                        i += binRows;
                        // Collide with particles in the bin below
                        _interactionsBetweenBins(p, bins[i]);

                        if (x > 0) {
                            // Collide with particles in the bin below and left
                            _interactionsBetweenBins(p, bins[i - 1]);
                        }
                        
                        if (x < binRows - 1) {
                            // Collide with particles in the bin below and right
                            _interactionsBetweenBins(p, bins[i + 1]);
                        }
                    }
                }
            }
        }

        function _getBinnedParticles() {
            // Create 1D array of bins
            var i, bins = [];
            for (i = 0; i < nBins; i++) {
                bins.push([]);
            }

            // Add each particle to a bin
            var d = 1 / binSize;
            for (i = 0; i < nParticles; i++) {
                var x = floor(particles[i].x * d);
                var y = floor(particles[i].y * d);
                var b = y * binRows + x;
                
                bins[b].push(particles[i]);
            }

            return bins;
        }

        function _interactionsBetweenBins(bin1, bin2) {
            var n = bin2.length;
                        
            if (n) {
                var i, j
                for (i = 0; i < bin1.length; i++) {
                    for (j = 0; j < n; j++) {
                        _particleInteraction(bin1[i], bin2[j]);
                    }
                }
            }
        }

        function _particleInteraction(p1, p2) {
            var dx = p2.x - p1.x;
            if (dx > config.bondLimit) { return; }
            
            var dy = p2.y - p1.y;
            if (dy > config.bondLimit) { return; }
            
            var d = dx * dx + dy * dy;

            if (d < bondLimitSq) {
                d = sqrt(d);
                
                var force = config.bondStrength * (config.bondLength - d);
                if (d > config.bondLength) {
                    // reduce attract based on distance
                    force *= (config.bondLimit - d) / bondDiff;
                }
                
                // Find new distance
                var d2 = d + force * 2;
                
                // Find new force based on new distance
                var force2 = config.bondStrength * (config.bondLength - d2);
                if (d2 > config.bondLength) {
                    // reduce attract based on distance
                    force2 *= (config.bondLimit - d2) / bondDiff;
                }
                
                // Take mean and divide by d to get unit vector
                force = (force + force2) / (2 * d);
                
                dx *= force;
                dy *= force;
                
                p1.dx -= dx;
                p1.dy -= dy;
                p2.dx += dx;
                p2.dy += dy;

                if (findEdges && d < config.bondLength + 1) {
                    edges.push([p1, p2]);
                }
            }
        }

        return {
            set: set,
            draw: draw,
            scale: scale,
            update: update,
            initialDraw: initialDraw,
            particles: particles,
            addParticles: addParticles,
            addOrderedBlock: addOrderedBlock,
            addDisorderedBlock: addDisorderedBlock, 
            stop: stop,
            start: start,
            save: saveState,
            restart: restoreState,
            isRunning: isRunning,
            toggleRunning: toggleRunning,
            addPlayPauseButton: addPlayPauseButton
        };
    }

    return {
        makeWorld: makeWorld
    };
})();
