import { SimpleRotator } from './simple-rotator.service';

export class WebGL {
    constructor() {
        const canvas = document.getElementById('canvas');
        this.gl = canvas.getContext('webgl', { premultipliedAlpha: false });
        if (!this.gl) {
            this.gl = canvas.getContext('experimental-webgl');
        }

        this.aCoords = null;
        this.aCoordsBuffer = null;
        this.uColor = null;
        this.uProjection = null;
        this.uModelview = null;
        this.uNormal = null;
        this.uLit = null;
        this.uNormalMatrix = null;
        /* eslint-disable */
        this.projection = mat4.create();
        this.modelview = mat4.create();
        this.normalMatrix = mat3.create();
        /* eslint-enable */

        try {
            const vertexShaderSource = WebGL.getTextContent('vshader');
            const fragmentShaderSource = WebGL.getTextContent('fshader');
            const prog = this.createProgram(this.gl, vertexShaderSource, fragmentShaderSource);
            this.gl.useProgram(prog);
            this.aCoords = this.gl.getAttribLocation(prog, 'coords');
            this.uModelview = this.gl.getUniformLocation(prog, 'modelview');
            this.uProjection = this.gl.getUniformLocation(prog, 'projection');
            this.uColor = this.gl.getUniformLocation(prog, 'color');
            this.uLit = this.gl.getUniformLocation(prog, 'lit');
            this.uNormal = this.gl.getUniformLocation(prog, 'normal');
            this.uNormalMatrix = this.gl.getUniformLocation(prog, 'normalMatrix');
            this.aCoordsBuffer = this.gl.createBuffer();
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.CULL_FACE);

            this.rotator = new SimpleRotator(canvas, this.render.bind(this));
            this.rotator.setView([2, 2, 5], [0, 1, 0], 6);
        } catch (e) {
            return e;
        }
    }

    static getTextContent(elementID) {
        const element = document.getElementById(elementID);
        let node = element.firstChild;
        let str = '';
        while (node) {
            if (node.nodeType === 3) {
                str += node.textContent;
            }
            node = node.nextSibling;
        }
        return str;
    }

    createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vsh = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vsh, vertexShaderSource);
        this.gl.compileShader(vsh);

        const fsh = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fsh, fragmentShaderSource);
        this.gl.compileShader(fsh);

        const prog = this.gl.createProgram();
        this.gl.attachShader(prog, vsh);
        this.gl.attachShader(prog, fsh);
        this.gl.linkProgram(prog);

        return prog;
    }


    drawPrimitive(primitiveType, color, vertices) {
        this.gl.enableVertexAttribArray(this.aCoords);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.aCoordsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STREAM_DRAW);
        this.gl.uniform4fv(this.uColor, color);
        this.gl.vertexAttribPointer(this.aCoords, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(primitiveType, 0, vertices.length / 3);
    }

    drawTriangle(p1, p2, p3) {
        this.drawPrimitive(
            this.gl.TRIANGLE_FAN,
            [1, 0, 0, 1],
            [
                p1.x, p1.y, p1.z,
                p2.x, p2.y, p2.z,
                p3.x, p3.y, p3.z,
            ],
        );
    }

    drawLine(points) {
        const linePoints = points.reduce((arr, { x, y, z }) => (
            [
                ...arr,
                x, y, z,
            ]
        ), []);

        this.drawPrimitive(
            this.gl.LINES,
            [1, 0, 0, 1],
            linePoints,
        );
    }

    apply(code) {
        this.code = code;
    }

    render() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // eslint-disable-next-line
        mat4.perspective(this.projection, Math.PI / 4, 1, 2, 10);

        this.gl.uniformMatrix4fv(this.uProjection, false, this.projection);

        const modelview = this.rotator.getViewMatrix();
        this.gl.uniformMatrix4fv(this.uModelview, false, modelview);

        // eslint-disable-next-line
        mat3.normalFromMat4(this.normalMatrix, modelview);
        this.gl.uniformMatrix3fv(this.uNormalMatrix, false, this.normalMatrix);

        this.gl.uniform1i(this.uLit, 1); // Turn on lighting calculations for the cube.


        /**
         * SIG LIBRARY
         */
        const thatGL = this;

        const powf = (x, y) => {
            return x ** y;
        };

        const gsout = (text) => {
            document.getElementById('console-entry').innerText += text;
        };

        const renderList = [];
        const render = () => {
            renderList.forEach(node => node.run());
        };

        const rootg = () => ({
            add: (node) => {
                renderList.push(node);
            },
        });

        class GsColor {
            static random() {
                return '#333';
            }
        }
        class SnLines {
            run() {
                this.color = '';
            }

            color(color) {
                this.color = color;
            }
        }
        class SnMyNode {
            constructor() {
                this.width = 0;
                this.height = 0;
                this.depth = 0;
                this.position = { x: 0, y: 0, z: 0 };

                this.init = {
                    set: (x, y, z) => {
                        this.position = { x, y, z };
                        return true;
                    },
                };
            }

            color(color) {
                this.color = color;
            }

            run() {
                thatGL.drawTriangle(
                    {
                        x: this.position.x,
                        y: this.position.y,
                        z: this.position.z,
                    },
                    {
                        x: this.position.x + this.width,
                        y: this.position.y,
                        z: this.position.z,
                    },
                    {
                        x: this.position.x,
                        y: this.position.y + this.height,
                        z: this.position.z,
                    },
                );

                thatGL.drawTriangle(
                    {
                        x: this.position.x + this.width,
                        y: this.position.y,
                        z: this.position.z,
                    },
                    {
                        x: this.position.x + this.width,
                        y: this.position.y + this.height,
                        z: this.position.z,
                    },
                    {
                        x: this.position.x,
                        y: this.position.y + this.height,
                        z: this.position.z,
                    },
                );
            }
        }

        const GsPnt2 = (x = 0, y = 0, z = 0) => {
            return {
                x,
                y,
                z,
                set: (x = 0, y = 0, z = 0) => {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                },
            };
        };

        const GsVec = GsPnt2;

        const GsPrimitive = {
            // Box(height, width, depth, origin)
            Box: (height, width, depth, orientation, origin) => {
                return {
                    height,
                    width,
                    depth,
                    orientation,
                    origin,
                    run() {
                        const drawSquare = (a, b, c, d) => {
                            thatGL.drawTriangle(a, b, c);
                            thatGL.drawTriangle(b, d, c);
                        };

                        const drawFaceF = (position, w, h) => {
                            drawSquare(
                                {
                                    x: position.x,
                                    y: position.y,
                                    z: position.z,
                                },
                                {
                                    x: position.x + w,
                                    y: position.y,
                                    z: position.z,
                                },
                                {
                                    x: position.x,
                                    y: position.y + h,
                                    z: position.z,
                                },
                                {
                                    x: position.x + w,
                                    y: position.y + h,
                                    z: position.z,
                                },
                            );
                        };

                        const drawFaceT = (position, w, d) => {
                            drawSquare(
                                {
                                    x: position.x,
                                    y: position.y,
                                    z: position.z,
                                },
                                {
                                    x: position.x,
                                    y: position.y,
                                    z: position.z + d,
                                },
                                {
                                    x: position.x + w,
                                    y: position.y,
                                    z: position.z,
                                },
                                {
                                    x: position.x + w,
                                    y: position.y,
                                    z: position.z + d,
                                },
                            );
                        };

                        const drawFaceL = (position, h, d) => {
                            drawSquare(
                                {
                                    x: position.x,
                                    y: position.y,
                                    z: position.z,
                                },
                                {
                                    x: position.x,
                                    y: position.y + h,
                                    z: position.z,
                                },
                                {
                                    x: position.x,
                                    y: position.y,
                                    z: position.z + d,
                                },
                                {
                                    x: position.x,
                                    y: position.y + h,
                                    z: position.z + d,
                                },
                            );
                        };


                        drawFaceF(origin, width, height);
                        drawFaceF({
                            ...origin,
                            z: depth,
                        }, width, height);

                        drawFaceT({
                            ...origin,
                            y: origin.y + height,
                        }, width, depth);

                        drawFaceT(origin, width, depth);

                        drawFaceL(origin, width, depth);

                        drawFaceL({
                            ...origin,
                            x: origin.x + width,
                        }, height, depth);
                    },
                };
            },
        };

        class SnGroup {
            constructor() {
                this._prim = [];
            }

            add(node) {
                this._prim.push(node);
            }
        }

        class SnManipulator {
            constructor() {
                this.mat = null;
                this._child = null;
            }

            // eslint-disable-next-line
            initial_mat(mat) {
                this.mat = mat;
            }

            child(_child) {
                this._child = _child;
            }

            run() {
                this._child._prim.forEach(node => node.run());
            }
        }

        function GsMat() {
            return {
                mat: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]],
                _translation: null,
                // eslint-disable-next-line
                translation: function (t) {
                    this._translation = t;
                },
            };
        }

        function GsQuat(x, y, z, w) {
            return {
                x,
                y,
                z,
                w,
            };
        }

        class SnPrimitive {
            constructor(type, a, b = 0, c = 0) {
                // void set ( GsPrimitive::Type t, float a, float b=0, float c=0 );
                this.primative = type(
                    a,
                    b,
                    c,
                    {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0,
                    },
                    { x: 0, y: 0, z: 0 },
                );
            }

            run() {
                this.primative.run();
            }

            prim() {
                return {
                    material: {
                        diffuse: '',
                    },
                    orientation: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0,
                    },
                };
            }
        }

        class SnPolyEditor {
            constructor() {
                this._polygons = [];
            }

            polygons(polygons) {
                this._polygons = polygons;
            }

            run() {
                this._polygons.forEach(polygon => polygon.run());
            }
        }

        class GsPolygon extends Array {
            constructor(...args) {
                super(...args);
                this.openS = false;

                /* eslint-disable */
                this.constructor = GsPolygon;
                this.__proto__   = GsPolygon.prototype
                /* eslint-enable */
            }

            setpoly(str = '') {
                const coordList = str.split('  ')
                    .map((point) => {
                        const [x = 0, y = 0, z = 0] = point.split(' ');
                        return { x, y, z };
                    });

                coordList.forEach((coord, index) => {
                    this[index] = coord;
                });
            }

            open(state) {
                this.openS = state;
            }

            run() {
                const parsedPointList = this.reduce((arr, point, index, { length }) => {
                    if ((index - 1) < length && index > 0) {
                        arr.push(point);
                    }

                    arr.push(point);

                    return arr;
                }, []);

                thatGL.drawLine(parsedPointList);
            }
        }

        class GsPolygons extends Array {
            constructor(...args) {
                super(...args);

                /* eslint-disable */
                this.constructor = GsPolygons;
                this.__proto__   = GsPolygons.prototype;
                /* eslint-enable */
            }

            get(index) {
                return this[index];
            }

            push() {
                this[this.length] = new GsPolygon();
            }

            deg() {}

            polygons(polygons) {
                this._polygons = polygons;
            }
        }

        class GsArray extends Array {
        }

        class SnLines2 {
            constructor() {
                this.P = [];
                this.Pc = [];
                this.V = [];
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
                return !this.V.length && !this.P.length;
            }

            size() {
                return this.V.length + this.P.length;
            }

            // eslint-disable-next-line
            line_width(lwidth) {
                if (lwidth) {
                    this.lwidth = lwidth;
                }

                return this.lwidth;
            }

            push(vec) {
                this.P.push(vec);
            }

            run() {
                thatGL.drawLine(this.P);
            }
        }

        /**
         * END SIG LIBRARY
         */

        if (this.code) {
            // eslint-disable-next-line
            eval(this.code);
        }

        /*
        this.gl.uniform3f(this.uNormal, 0, 0, 1);
        this.drawPrimitive(this.gl.TRIANGLE_FAN, [1, 0, 0, 1], [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1]);
        this.gl.uniform3f(this.uNormal, 0, 0, -1);
        this.drawPrimitive(this.gl.TRIANGLE_FAN, [0, 1, 0, 1], [-1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1]);
        this.gl.uniform3f(this.uNormal, 0, 1, 0);
        this.drawPrimitive(this.gl.TRIANGLE_FAN, [0, 0, 1, 1], [-1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1]);
        this.gl.uniform3f(this.uNormal, 0, -1, 0);
        this.drawPrimitive(this.gl.TRIANGLE_FAN, [1, 1, 0, 1], [-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1]);
        this.gl.uniform3f(this.uNormal, 1, 0, 0);
        this.drawPrimitive(this.gl.TRIANGLE_FAN, [1, 0, 1, 1], [1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1]);
        this.gl.uniform3f(this.uNormal, -1, 0, 0);
        this.drawPrimitive(this.gl.TRIANGLE_FAN, [0, 1, 1, 1], [-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1]);
        */

        this.gl.uniform1i(this.uLit, 0); // The lines representing the coordinate axes are not lit.

        // xyz coordinates
        this.gl.lineWidth(4);
        this.drawPrimitive(this.gl.LINES, [1, 0, 0, 1], [-2, 0, 0, 2, 0, 0]);
        this.drawPrimitive(this.gl.LINES, [0, 1, 0, 1], [0, -2, 0, 0, 2, 0]);
        this.drawPrimitive(this.gl.LINES, [0, 0, 1, 1], [0, 0, -2, 0, 0, 2]);
        this.gl.lineWidth(1);
    }
}

