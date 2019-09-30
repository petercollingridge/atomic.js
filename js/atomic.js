var Atomic = (function () {
    var Atomic = {
        makeWorld: function(id, width, height) {
            var parent = document.getElementById(id);
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            parent.appendChild(canvas);
        }
    };

    return Atomic;
})();
