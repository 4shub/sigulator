// WebGL - 2D Rectangles
// from https://webglfundamentals.org/webgl/webgl-2d-rectangles.html

"use strict";

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    function drawRectangle(x, y, w, h) {
        setRectangle(gl, x, y, w, h);
        // Set a random color.
        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }


    function rootg() {
        return {
            add: function (node) {
                node.run();
            }
        }
    }

    class GsColor {
        static random() {
            return `#333`;
        }
    }

    class SnMyNode {
        constructor() {
            this.width = 0;
            this.height = 0;
            this.depth = 0;
            this.position = { x: 0, y: 0, z: 0 };

            var that = this;
            this.init =  {
                set: function (x, y, z) {
                    that.position = { x: x, y: y, z: z };
                    return true;
                },
            }
        }

        color(color) {
            this.color = color;
        }

        run() {
            drawRectangle(this.position.x, this.position.y, this.width, this.height)
        }
    }

    class GsPnt {
        constructor() {
            this.x = 0;
            this.y = 0;
        }

        set(x, y) {
            this.x = x;
            this.y = y;
        }

        run() {
            drawRectangle(this.position.x, this.position.y, this.width, this.height)
        }
    }

    class GsVec extends GsPnt2 {};

    class GsArray extends Array {};

    class SnLines2 {
        constructor() {
            this.P = [];  //<! Array of points forming independent segments
            this.Pc = [];
            this.V = [];  //<! Array of vertices forming indexed polylines
            this.Vc = [];
            this.I = [];
            this.Is = [];
            this.zcoordinate = 0;
            this.gsword = '';
            this.lwidth = 1;
        }

        init() {

        }

        empty() {
            return !V.length && !P.length;
        }

        size() {
            return V.length + P.length;
        }

        line_width(lwidth){
            this.lwidth = lw;
        }

        push(vec) {
            this.P.push(vec);
        }

        push(x, y) {
            this.P.push(GsPnt2)
        }
    };

    document.getElementById('compile').onclick = function () {
        const script = document.getElementById('code-entry').value.toString();

        const parsedCode = script
            .split(';')
            .map(function (code) {
                return code
                    .replace(/([a-z*]*) ([a-z0-9]*) = ([a-z0-9]*)/i, function (match, p1, p2, p3) {
                        if (!p1.trim().length) {
                            return match;
                        }
                        return 'let ' + p2 + ' = ' + p3;
                    })
                    .replace(/(->|::)/g, '.')
                    .replace(/([a-z ]*)<< (.*)/g, function(match, p1, p2) {
                        return 'gsout("' + p2
                            .replace(/<</g, '')
                            .replace(/("|')/g, '') + '")';
                    })
                    .replace(/new\s.*(\s|$)/gi, function(match) { return match + '()' })
            })
            .join(';');

        // clear console
        document.getElementById('console-entry').innerHTML = '';
        try {
            console.log(parsedCode);
            eval(parsedCode);
        } catch (e) {
            document.getElementById('console-entry').innerHTML = e;
        }
        //eval();
    };
}


function gsout(str) {
    document.getElementById('console-entry').innerHTML += str + '\n';
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}


function setTriangle(gl, vec1, vec2, vec3) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}



/*
    Run Program
 */
main();
