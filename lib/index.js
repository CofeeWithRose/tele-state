import { GlImage } from './GLElement/GLImage';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shader';
import { compileShader, SHADER_TYPE } from './util';
import { TextureCanvasManager } from './TextureCanvasManager';
export var GL_ELEMENT_TYPES;
(function (GL_ELEMENT_TYPES) {
    GL_ELEMENT_TYPES["GL_IMAGE"] = "GL_IMAGE";
})(GL_ELEMENT_TYPES || (GL_ELEMENT_TYPES = {}));
var GLRender = /** @class */ (function () {
    function GLRender(glCanvas, options) {
        var _a;
        var _this = this;
        if (options === void 0) { options = { bufferSize: 100 }; }
        this.options = options;
        this.textureCanvas = new TextureCanvasManager();
        this.elemetList = [];
        this.id = 0;
        this.GLElemetMap = (_a = {},
            _a[GL_ELEMENT_TYPES.GL_IMAGE] = GlImage,
            _a);
        this.needSort = false;
        this.positionChanged = false;
        this.textureChanged = false;
        this.rafing = false;
        this.updateImidiatly = function () {
            if (_this.needSort) {
                _this.positionChanged = true;
                _this.textureChanged = true;
                _this.elemetList.sort(function (_a, _b) {
                    var z1 = _a.zIndex;
                    var z2 = _b.zIndex;
                    return z1 - z2;
                });
                _this.attrData.a_position.fill(0);
                _this.attrData.a_size.fill(0);
                _this.attrData.a_texCoord.fill(0);
            }
            _this.elemetList.forEach(function (_a, index) {
                var position = _a.position, imgId = _a.imgId;
                if (_this.positionChanged) {
                    var startIndex = index * 3 * 3;
                    _this.attrData.a_position[startIndex] = position.x;
                    _this.attrData.a_position[startIndex + 1] = position.y;
                    _this.attrData.a_position[startIndex + 2] = 1;
                    _this.attrData.a_position[startIndex + 3] = position.x;
                    _this.attrData.a_position[startIndex + 4] = position.y;
                    _this.attrData.a_position[startIndex + 5] = 2;
                    _this.attrData.a_position[startIndex + 6] = position.x;
                    _this.attrData.a_position[startIndex + 7] = position.y;
                    _this.attrData.a_position[startIndex + 8] = 3;
                }
                if (_this.textureChanged) {
                    var startIndex = index * 3 * 2;
                    var _b = _this.textureCanvas.getImageInfos([imgId])[0], x = _b.x, y = _b.y, w = _b.w, h = _b.h;
                    _this.attrData.a_texCoord[startIndex] = x;
                    _this.attrData.a_texCoord[startIndex + 1] = y;
                    _this.attrData.a_texCoord[startIndex + 2] = x;
                    _this.attrData.a_texCoord[startIndex + 3] = y;
                    _this.attrData.a_texCoord[startIndex + 4] = x;
                    _this.attrData.a_texCoord[startIndex + 5] = y;
                    _this.attrData.a_size[startIndex] = w;
                    _this.attrData.a_size[startIndex + 1] = h;
                    _this.attrData.a_size[startIndex + 2] = w;
                    _this.attrData.a_size[startIndex + 3] = h;
                    _this.attrData.a_size[startIndex + 4] = w;
                    _this.attrData.a_size[startIndex + 5] = h;
                }
            });
            if (_this.positionChanged) {
                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.attrBuffer.a_position);
                _this.gl.bufferData(_this.gl.ARRAY_BUFFER, _this.attrData.a_position, _this.gl.STATIC_DRAW);
            }
            if (_this.textureChanged) {
                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.attrBuffer.a_texCoord);
                _this.gl.bufferData(_this.gl.ARRAY_BUFFER, _this.attrData.a_texCoord, _this.gl.STATIC_DRAW);
                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.attrBuffer.a_size);
                _this.gl.bufferData(_this.gl.ARRAY_BUFFER, _this.attrData.a_size, _this.gl.STATIC_DRAW);
            }
            _this.positionChanged = false;
            _this.textureChanged = false;
            _this.needSort = false;
            _this.gl.drawArrays(_this.gl.TRIANGLES, 0, _this.attrData.a_position.length / 3);
        };
        this.update = function () {
            if (_this.rafing)
                return;
            _this.rafing = true;
            requestAnimationFrame(function () {
                _this.updateImidiatly();
                _this.rafing = false;
            });
        };
        this.gl = glCanvas.getContext('webgl', { alpha: true });
        var program = this.gl.createProgram();
        compileShader(this.gl, program, VERTEX_SHADER, SHADER_TYPE.VERTEX_SHADER);
        compileShader(this.gl, program, FRAGMENT_SHADER, SHADER_TYPE.FRAGMENT_SHADER);
        this.gl.linkProgram(program);
        this.gl.useProgram(program);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.uniformLocations = {
            u_windowSize: this.gl.getUniformLocation(program, 'u_windowSize')
        };
        this.attribuitesLocations = {
            a_position: this.gl.getAttribLocation(program, 'a_position'),
            a_size: this.gl.getAttribLocation(program, 'a_size'),
            a_texCoord: this.gl.getAttribLocation(program, 'a_texCoord')
        };
        this.initBuffer();
        this.initTexture();
        this.setViewPort();
    }
    GLRender.prototype.initTexture = function () {
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        // this.gl.texParameteri(this.gl.texImage2D,)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureCanvas.canvas);
    };
    GLRender.prototype.initBuffer = function () {
        this.attrData = {
            a_position: new Float32Array(this.options.bufferSize * 3 * 3),
            a_size: new Float32Array(this.options.bufferSize * 3 * 2),
            a_texCoord: new Float32Array(this.options.bufferSize * 3 * 2)
        };
        var positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_position, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_position);
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_position, 3, this.gl.FLOAT, false, 0, 0);
        var sizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_size, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_size);
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_size, 2, this.gl.FLOAT, false, 0, 0);
        var texCoord = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoord);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_texCoord, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_texCoord);
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_texCoord, 2, this.gl.FLOAT, false, 0, 0);
        this.attrBuffer = {
            a_position: positionBuffer,
            a_size: sizeBuffer,
            a_texCoord: texCoord
        };
    };
    GLRender.prototype.setViewPort = function () {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform2f(this.uniformLocations.u_windowSize, this.gl.canvas.width, this.gl.canvas.height);
    };
    GLRender.prototype.createElement = function (type, params) {
        var img = new this.GLElemetMap[type](this.update, params);
        this.elemetList.push(img);
        this.needSort = true;
        this.update();
        return img;
    };
    GLRender.prototype.destoryElement = function (ele) {
        var ind = this.elemetList.findIndex(function (el) { return el === ele; });
        if (ind > -1) {
            this.elemetList.splice(ind, 1);
        }
    };
    GLRender.prototype.loadImgs = function (imgs) {
        var ids = this.textureCanvas.setImages(imgs);
        return ids;
    };
    return GLRender;
}());
export { GLRender };
