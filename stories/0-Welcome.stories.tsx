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


const fgShaderStr = `
precision mediump float;
void main(){
    gl_FragColor = vec4(1,0,0.51, 0.8);    
}
`

const vertShaderStr = `
attribute vec4 a_position;
void main(){
    gl_Position = a_position;
}
`

const Test = () => {
  
  const cRef= useRef<HTMLCanvasElement>(null)
  const glRef = useRef(null)

  useEffect(() => {
    if(!cRef.current) return
    const gl = glRef.current = cRef.current.getContext('webgl')
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

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
      0, 0,
      0, 0.5,
      0.7, 0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.viewport(0, 0, 1440, 800)

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    
    gl.useProgram(program)

    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    const size = 2;          // 每次迭代运行提取两个单位数据
    const type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    const normalize = false; // 不需要归一化数据
    const  stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                          // 每次迭代运行运动多少内存到下一个数据开始点
    const offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)


    const primitiveType = gl.TRIANGLES;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);

  }, [])

  return <>
   <canvas ref={cRef} width={1440} height={800} ></canvas>
  </>
}



export default {
  title: 'Welcome',
  component: Test,
};

export const ToStorybook = () => <Test />;

ToStorybook.story = {
  name: 'webgl',
};
