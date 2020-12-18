import { GlImage } from './GLElement/GLImage'
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shader';
import { compileShader, SHADER_TYPE } from './util';
import { Vec2 } from './Data/Vec2'
import { TextureCanvasManager } from './TextureCanvasManager'
import { GLElement } from './GLElement/GLElement'


export enum GL_ELEMENT_TYPES {

    GL_IMAGE='GL_IMAGE'
}

export interface GLElements {

    [GL_ELEMENT_TYPES.GL_IMAGE]: GlImage
}

export interface GLElementTypes {

    [GL_ELEMENT_TYPES.GL_IMAGE]: typeof GlImage
}


export interface GLElementParams{

    [GL_ELEMENT_TYPES.GL_IMAGE]: { imgId: number, position:Vec2 }
}



export class GLRender {

    private  textureCanvas = new  TextureCanvasManager();
  
    private elemetList: GLElement[] = []

    private id = 0;

    private GLElemetMap: GLElementTypes = {
        [GL_ELEMENT_TYPES.GL_IMAGE]: GlImage
    }

    private gl:WebGLRenderingContext;

    private uniformLocations: { u_windowSize?: WebGLUniformLocation};

    private attribuitesLocations: {
        a_position: number
        a_size: number;
        a_texCoord: number;
    };

    private attrData: {
        a_position: Float32Array,
        a_size: Float32Array,
        a_texCoord: Float32Array
    }

    private attrBuffer: {
        a_position: WebGLBuffer,
        a_size: WebGLBuffer,
        a_texCoord: WebGLBuffer
    }
  
    private needSort = false

    private positionChanged = false

    private textureChanged = false

    private rafing = false

    constructor( glCanvas: HTMLCanvasElement, private options = { bufferSize: 100 }  ){
        this.gl = glCanvas.getContext('webgl', { alpha: true })
        const program = this.gl.createProgram()
        compileShader(this.gl, program, VERTEX_SHADER,SHADER_TYPE.VERTEX_SHADER )
        compileShader(this.gl, program, FRAGMENT_SHADER, SHADER_TYPE.FRAGMENT_SHADER)
        this.gl.linkProgram(program)
        this.gl.useProgram(program)
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        this.uniformLocations = {
            u_windowSize: this.gl.getUniformLocation(program, 'u_windowSize')
        }
        this.attribuitesLocations = {
            a_position: this.gl.getAttribLocation(program, 'a_position'),
            a_size: this.gl.getAttribLocation(program, 'a_size'),
            a_texCoord: this.gl.getAttribLocation(program, 'a_texCoord')
        }
        this.initBuffer()
        this.initTexture()
        this.setViewPort()
    }

    private updateImidiatly = () => {

        if(this.needSort){
            this.positionChanged = true
            this.textureChanged = true
            this.elemetList.sort(( {zIndex: z1}, {zIndex: z2} ) =>  z1 -z2 )
            this.attrData.a_position.fill(0)
            this.attrData.a_size.fill(0)
            this.attrData.a_texCoord.fill(0)
            
        }

        this.elemetList.forEach(({ position, imgId }, index) => {

            if(this.positionChanged){
                const startIndex = index * 3 *3
                this.attrData.a_position[startIndex] = position.x
                this.attrData.a_position[startIndex + 1] = position.y
                this.attrData.a_position[startIndex + 2] = 1

                this.attrData.a_position[startIndex + 3] = position.x
                this.attrData.a_position[startIndex + 4] = position.y
                this.attrData.a_position[startIndex + 5] = 2

                this.attrData.a_position[startIndex + 6] = position.x
                this.attrData.a_position[startIndex + 7] = position.y
                this.attrData.a_position[startIndex + 8] = 3
            }

            if(this.textureChanged){

                const startIndex = index * 3*2

                const [{ x,y, w, h }] = this.textureCanvas.getImageInfos([imgId])

                this.attrData.a_texCoord[startIndex] = x
                this.attrData.a_texCoord[startIndex + 1] = y

                this.attrData.a_texCoord[startIndex+ 2] = x
                this.attrData.a_texCoord[startIndex + 3] = y

                this.attrData.a_texCoord[startIndex+4] = x
                this.attrData.a_texCoord[startIndex + 5] = y

                this.attrData.a_size[startIndex] = w
                this.attrData.a_size[startIndex + 1] = h

                this.attrData.a_size[startIndex+ 2] = w
                this.attrData.a_size[startIndex + 3] = h

                this.attrData.a_size[startIndex+4] = w
                this.attrData.a_size[startIndex + 5] = h

            }

        })
        
        if(this.positionChanged){
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.attrBuffer.a_position )
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_position, this.gl.STATIC_DRAW)
        }

        if(this.textureChanged) {

            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.attrBuffer.a_texCoord )
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_texCoord, this.gl.STATIC_DRAW)

            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.attrBuffer.a_size )
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_size, this.gl.STATIC_DRAW)
        }

        this.positionChanged = false
        this.textureChanged = false
        this.needSort = false
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attrData.a_position.length/3)
    }

    private initTexture() {
        const texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        // this.gl.texParameteri(this.gl.texImage2D,)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureCanvas.canvas)
    }

    private initBuffer(){

        this.attrData  = {
            a_position: new Float32Array(this.options.bufferSize * 3 * 3 ),
            a_size: new Float32Array(this.options.bufferSize * 3 *2 ),
            a_texCoord: new Float32Array(this.options.bufferSize * 3 *2 ),
        }
        const positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_position, this.gl.STATIC_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_position)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_position, 3, this.gl.FLOAT, false, 0,0)

        const sizeBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizeBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_size, this.gl.STATIC_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_size)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_size, 2, this.gl.FLOAT, false, 0,0)

        const texCoord = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoord)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_texCoord, this.gl.STATIC_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_texCoord)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_texCoord, 2, this.gl.FLOAT, false, 0,0)

        this.attrBuffer = {
            a_position : positionBuffer,
            a_size: sizeBuffer,
            a_texCoord: texCoord,
        }
    }

    setViewPort(){
        this.gl.viewport( 0, 0, this.gl.canvas.width , this.gl.canvas.height )
        this.gl.uniform2f(this.uniformLocations.u_windowSize, this.gl.canvas.width, this.gl.canvas.height )
    }
  
    createElement<T extends GL_ELEMENT_TYPES>( type: T, params: GLElementParams[T] ): GLElements[T] {
        const img =  new this.GLElemetMap[type](this.update, params)
        this.elemetList.push(img)
        this.needSort = true
        this.update()
        return img
    }

    destoryElement(ele: GLElement){
        const ind = this.elemetList.findIndex(el => el === ele)
        if(ind > -1){
            this.elemetList.splice(ind, 1)
        }
    }

    loadImgs( imgs: HTMLCanvasElement[] ): number[] {
      const ids = this.textureCanvas.setImages(imgs)
      return ids
    }
  
    private update = () => {
        if(this.rafing) return 
        this.rafing = true
        requestAnimationFrame( () => {
            this.updateImidiatly()
            this.rafing = false
        } )
    }
  
  }

