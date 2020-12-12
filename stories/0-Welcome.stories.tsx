import React, { useMemo, useEffect, useRef } from 'react';
import { linkTo } from '@storybook/addon-links';
// import { Welcome } from '@storybook/react/demo';
import { createTeleState } from '../lib/index'

// const { useTeleState } = createTeleState(1);
// // const { useTeleState: useLog, dispatch} = createTeleState<string[][]>([])
// // const log = (...logs: any[]) => dispatch(pre => [...pre, logs])
// const ComponentA = () => {
//   const [ count, setCount ] = useTeleState()
//   // useMemo(() =>setCount(7),[] )
//   useEffect(() => {
//     console.log(`ComponentA useEffect--`, count)
//   }, [count])
//   console.log('ComponentA render--', count)
 
//   return <div>
//     <button
//       onClick={() => setCount(count+1)}
//     >
//       ComponentA{count}
//     </button>
//     <ComponentB count={count}/>
//   </div>
// }
// const ComponentB = ({count:c=1, type="B" }) => {
//   const [ count, setCount ] = useTeleState()
//   // useMemo(() =>setCount(7),[] )
//   console.log(`Component${type} render--`, count)
//   useEffect(() => {
//     console.log(`Component${type} useEffect--`, count)
//   }, [count])
//   return <button
//     onClick={() => setCount(count+1)}
//   >
//     Component{type}{count} ...{c}
//   </button>
// }

// const tC = document.createElement('canvas')
// const size = 5
// tC.width =size
// tC.height =size
// const ctx = tC.getContext('2d')
// // ctx.rotate(45 * Math.PI /180)
// ctx.fillRect(0,0, size, size)

// const tC2 = document.createElement('canvas')

// tC2.width =size
// tC2.height =size
// const ctx2 = tC2.getContext('2d')
// ctx2.fillStyle = 'red'
// // ctx.rotate(45 * Math.PI /180)
// ctx2.fillRect(0,0, size, size)




// const bRecList = []
// for(let i =0; i< 280; i++) {

//   for(let j=0; j< 140; j++){
//     bRecList.push({ x: i*12, y: j*12  })
//     // bRecList.push({ x: i*6.1, y: j*6.1  })
//   } 
 
// } 

const vertShaderStr = `

uniform vec2 u_windowSize;

attribute vec2 a_position;
attribute vec4 a_color;
attribute float a_r;

varying vec4 v_color;
varying float v_r;
varying vec2 v_position;
varying vec2 v_windowSize;

void main(){
  v_color = a_color;
  gl_Position = vec4((a_position/u_windowSize *2.0 -1.0) * vec2(1, -1), 0, 1 );
  v_position = a_position;

  v_r = a_r;
  gl_PointSize = 2.0* a_r;

  v_windowSize = u_windowSize;
}
`

const fgShaderStr = `
precision highp float;

varying vec4 v_color;
varying float v_r;
varying vec2 v_position;
varying vec2 v_windowSize;

// gl_FragCoord
// gl_PointCoord
void main(){

  float dist = distance( v_position, vec2(gl_FragCoord.x, v_windowSize.y - gl_FragCoord.y)  );
  if(dist> v_r) {
    discard;
  }else{
    // * smoothstep( v_r, v_r-0.0001,  dist)
    gl_FragColor = vec4(v_color.x, v_color.y, v_color.z, v_color.w );    
  }
}
`



const positions = [
  // 200, 200,
  // 300,300,
  // 600,300,

  // 100,100,
  // 200,200,
  // 100,200,
];
const c = [ 0,0,0,1]
const colors = [
  // 1,0,0,1,
  // 0,1,0,1,
  // 0,0,1,1,

  // ...c,
  // ...c,
  // ...c,
]
const r = [
  // 100,
  // 10,
  // 50,
  
  // 10,
  // 100,
  // 50,
]

const wCount = 500
const hCount = 200

const pad = 0.1
const w = (1400/ wCount)-pad
const h = (800/ hCount) - pad
for(let i =0 ; i< wCount; i++){
  for(let j = 0; j< hCount; j++ ){
    const start = {x: (w + pad) * i + 0.5 *w , y: (h + pad)* j}
    // const angle = [
    //  start.x, start.y,
    //  start.x, start.y+h,
    //  start.x + w, start.y+h  
    // ]
    positions.push(start.x, start.y)
    colors.push(1,0,0,1)
    r.push(w * 0.5)
  }
}




const Test = () => {
  
  const cRef= useRef<HTMLCanvasElement>(null)
  const glRef = useRef(null)

  useEffect(() => {
    if(!cRef.current) return
    const gl = glRef.current = cRef.current.getContext('webgl', { alpha: true })
    const program = gl.createProgram()
    if(!program ) return

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertShaderStr)
    gl.compileShader(vertexShader)
    console.log('compile vexShader',gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, fgShaderStr)
    gl.compileShader(fragShader)
    console.log('compile fragShader', gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)
    console.log('link program', gl.getProgramParameter(program, gl.LINK_STATUS))


    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positionArray = new Float32Array(positions)
    gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    let size = 2;          // 每次迭代运行提取两个单位数据
    let type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    let normalize = false; // 不需要归一化数据
    let stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                          // 每次迭代运行运动多少内存到下一个数据开始点
    let offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    const colorArray = new Uint8Array(colors)
    gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STATIC_DRAW);
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    size = 4;          // 每次迭代运行提取两个单位数据
    type = gl.UNSIGNED_BYTE;   // 每个单位的数据类型是32位浮点型
    normalize = false; // 不需要归一化数据
    stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                          // 每次迭代运行运动多少内存到下一个数据开始点
    offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset)


    const raduisBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, raduisBuffer)
    const raduisArray = new Float32Array(r)
    gl.bufferData(gl.ARRAY_BUFFER, raduisArray, gl.STATIC_DRAW);
    const raduisAttributeLocation = gl.getAttribLocation(program, "a_r");
    gl.enableVertexAttribArray(raduisAttributeLocation);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    size = 1;          // 每次迭代运行提取两个单位数据
    type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    normalize = false; // 不需要归一化数据
    stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                          // 每次迭代运行运动多少内存到下一个数据开始点
    offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(raduisAttributeLocation, size, type, normalize, stride, offset)

    

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    
    gl.useProgram(program)

    

    const viewSize = gl.getUniformLocation(program, 'u_windowSize')
    gl.uniform2f(viewSize, gl.canvas.width, gl.canvas.height)

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    


  
    // gl.drawArrays(primitiveType, offset, count);
    // buffer[0] = 1
    // buffer[1] = 1
    // gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    // gl.drawArrays(primitiveType, offset, count);

    const primitiveType = gl.POINTS;
    var count =positions.length/2;
    const draw = () => {
      positionArray.forEach((_, ind) =>   positionArray[ind] += 0.1 )
      gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
      gl.drawArrays(primitiveType, offset, count);
      // requestAnimationFrame(draw)
    }
    draw()

  }, [])

  return <div style={{ backgroundColor: 'black' }} >
   <canvas ref={cRef} width={1400} height={800} ></canvas>
  </ div >
}



export default {
  title: 'Welcome',
  component: Test,
};

export const ToStorybook = () => <Test />;

ToStorybook.story = {
  name: 'webgl',
};
