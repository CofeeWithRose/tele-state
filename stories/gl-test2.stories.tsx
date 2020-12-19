import React, { useEffect, useRef } from 'react'




class Color { 

  constructor(
    private r: number,
    private g: number,
    private b: number,
    private a: number,
  ){}

}
enum SHAPE_TYPE {
  CIRCLE =1,
  RECTANGLE =2,
  ANGLE=3,
}
type Shape = {
  shapeType: { type: SHAPE_TYPE, index: number},
  position: {x: number, y:number },
  size: {width: number, height: number},
  borderWidth: [number, number, number, number]
  fillColor: Color
  borderColor: Color
}

const CANVAS_WIDTH = 1440

const CANVAS_HEIGHT = 800



const shapList: Shape[] = []

const positionList = [
  0,0,  100,100,  0,100,
]

const positionArray = new Float32Array(positionList)

const fillColorList = [
  1,0,0,1, 
  1,0,0,1,
  1,0,0,1,
]

const shapeList = [
  1, 1,
  1, 2,
  1, 3,
]

const shapArray = new Float32Array(shapeList)


const fillColorArray = new Float32Array(fillColorList)




// export function GLTest () {
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     const { current: canvas } = canvasRef
//     if(!canvas) return

//     const vertexShaderSource = `
//       uniform vec2 u_canvasSize;
      
//       attribute vec2 a_position;
//       attribute vec2 a_size;
//       attribute vec4 a_borderWidth;
//       attribute vec2 a_shapeType; // x: 1: circle; 2: rectangle; 3: angle, y: index.
     
//       attribute vec4 a_fillColor;
//       attribute vec4 a_borderColor;

//       varying vec4 v_fillColor;
//       varying vec4 v_borderColor;
//       varying vec2 v_shapeType;
//       varying vec2 v_canvasSize;
//       varying vec2 v_position;
//       varying vec2 v_size;

//       void handleCircle(){
//         vec2 p = ((a_position/u_canvasSize) * 2.0 -1.0) * vec2(1, -1);
//         v_position = a_position; // 圆心坐标.
//         if(a_shape.y>0.0 && a_shape.y <= 1.0){
//           normalizeGLPosition(a_position - a_size.x * vec2(0, 2.0) );
//           return;
//         }
//         if(a_shape.y>1.0 && a_shape.y <= 2.0){
//           normalizeGLPosition(a_position + a_size.x * vec2(1, 1) );
//           return;
//         }
        
//       }

//       void normalizeGLPosition(vec2 canvasPosition ) {

//         gl_Position = vec4( ((canvasPosition/u_canvasSize) * 2.0 -1.0) * vec2(1, -1) , 0, 1);

//       }

//       void main(){

//         v_fillColor = a_fillColor;
//         v_borderColor = a_borderColor;
//         v_shapeType = a_shapeType;
//         v_canvasSize = u_canvasSize;
//         v_size = a_size;

//         if( a_shapeType.x > 0.0&& a_shapeType.x <= 1.0 ){
//           handleCircle()
//         }

        

//         // gl_Position = vec4( ((a_position/u_canvasSize) * 2.0 -1.0) * vec2(1, -1) , 0, 1);

//       }
//     `
//     const fragmentShaderSource = `
//       precision highp float;

//       varying vec4 v_fillColor;
//       varying vec4 v_borderColor;
//       varying vec2 v_shapeType;
//       varying vec2 v_canvasSize;
//       varying vec2 v_position;
//       varying vec2 v_size;

//       void drawCircle() {
//         // vec2 fragCoord = gl_FragCoord +  vec2(0, -v_canvasSize.y )
//         // const dist = distance( fragCoord,  )
//         gl_FragColor = vec4( 1,0,0,1 );
//       }

//       void main(){

//         if( v_shapeType.x > 0.0 && v_shapeType.x<= 1.0){
//           drawCircle();
//           return;
//         }
//       }

//     `
//     function compileShader(
//       gl: WebGLRenderingContext, 
//       program: WebGLProgram,
//       source: string, 
//       type: SHADER_TYPE
//     ): WebGLShader {
//       const map: SHADER_TYPE_MAP= {
//         [SHADER_TYPE.VERTEX_SHADER]: gl.VERTEX_SHADER,
//         [SHADER_TYPE.FRAGMENT_SHADER]: gl.FRAGMENT_SHADER,
//       }
//       const shader = gl.createShader(map[type])
//       gl.shaderSource(shader, source)
//       gl.compileShader(shader)
//       console.log('compile shader success:', gl.getShaderParameter(shader, gl.COMPILE_STATUS) )
//       console.log('compile log', gl.getShaderInfoLog(shader))
//       gl.attachShader(program, shader)
//       return shader
//     }


//     const gl = canvas.getContext('webgl', { alpha: true })
//     const program = gl.createProgram()
    

//     compileShader(gl, program, vertexShaderSource, SHADER_TYPE.VERTEX_SHADER)
//     compileShader(gl,program, fragmentShaderSource, SHADER_TYPE.FRAGMENT_SHADER)
//     gl.linkProgram(program)
//     gl.useProgram(program)
//     console.log('link programe:', gl.getProgramParameter(program, gl.LINK_STATUS))

//     gl.viewport(0,0, CANVAS_WIDTH, CANVAS_HEIGHT)

//     const u_canvasSizeLoc =   gl.getUniformLocation(program,'u_canvasSize')
//     gl.uniform2f( u_canvasSizeLoc, CANVAS_WIDTH, CANVAS_HEIGHT )

//     const vertexShaderAttributes = {
//       a_shapeType: gl.getAttribLocation(program, 'a_shapeType'),
//       a_position: gl.getAttribLocation(program, 'a_position'),
//       a_size: gl.getAttribLocation(program, 'a_size'),
//       a_borderWidth: gl.getAttribLocation(program, 'a_borderWidth'),
//       a_fillColor: gl.getAttribLocation(program, 'a_fillColor'),
//       a_borderColor: gl.getAttribLocation(program, 'a_borderColor')
//     }
//     gl.enable(gl.BLEND)
//     gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)


//     const positionBuffer = gl.createBuffer()
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
//     gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW )
//     gl.enableVertexAttribArray(vertexShaderAttributes.a_position)
//     gl.vertexAttribPointer(vertexShaderAttributes.a_position, 2, gl.FLOAT, false, 0, 0 )

//     const fillColorBuffer = gl.createBuffer()
//     gl.bindBuffer(gl.ARRAY_BUFFER, fillColorBuffer)
//     gl.bufferData(gl.ARRAY_BUFFER,fillColorArray, gl.STATIC_DRAW)
//     gl.enableVertexAttribArray(vertexShaderAttributes.a_fillColor)
//     gl.vertexAttribPointer(vertexShaderAttributes.a_fillColor, 4, gl.FLOAT, false, 0, 0)


//     const shapeTypeBuffer = gl.createBuffer()
//     gl.bindBuffer(gl.ARRAY_BUFFER, shapeTypeBuffer)
//     gl.bufferData(gl.ARRAY_BUFFER, shapArray, gl.STATIC_DRAW)
//     gl.enableVertexAttribArray(vertexShaderAttributes.a_shapeType)
//     gl.vertexAttribPointer( vertexShaderAttributes.a_shapeType, 2, gl.FLOAT, false, 0, 0 )


//     gl.drawArrays(gl.TRIANGLES, 0, positionArray.length * 0.5)

//   }, [])

//   return <div>
//     <canvas 
//       ref={canvasRef} 
//       width={CANVAS_WIDTH} 
//       height={CANVAS_HEIGHT} 
//       style={{ 
//         width: CANVAS_WIDTH/ devicePixelRatio,
//         height: CANVAS_HEIGHT/ devicePixelRatio,  
//       }}
//     />
//   </div>
// }

export default {
  title: 'GL TEST',
  component: () => <></>,
};

// export const ToStorybook = () => <GLTest />;

// ToStorybook.story = {
//   name: 'webgl',
// };
