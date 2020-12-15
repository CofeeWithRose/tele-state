import React, { useEffect, useRef } from 'react';



const vertShaderStr = `

uniform vec2 u_windowSize;

attribute vec2 a_position;
attribute vec4 a_color;
attribute vec2 a_size;
attribute float a_type; // 1:circle; 2: rectangle;

varying vec2 v_windowSize;
varying vec4 v_color;
varying vec2 v_size;
varying vec2 v_position;
varying float v_type;

void main(){
  v_color = a_color;
  v_windowSize = u_windowSize;
  v_position = a_position;
  v_size = a_size;
  v_type = a_type;

  gl_Position = vec4((a_position/u_windowSize *2.0 -1.0) * vec2(1, -1), 0, 1 );
  
  if (a_type >0.0 && a_type <= 1.0) {
    // circle;
    gl_PointSize = 2.0 * a_size.x;
    return;
  }
  if (a_type>1.0 && a_type <= 2.0) {
    // rectangle
    gl_PointSize = max(a_size.x, a_size.y );
    return;
  }
  // gl_PointSize = a_size.x;
}
`

const fgShaderStr = `
precision highp float;

varying vec2 v_windowSize;
varying vec4 v_color;
varying vec2 v_size;
varying vec2 v_position;
varying float v_type;



void main(){

  if (v_type >0.0 && v_type <= 1.0) {
    // circle;
    float dist = distance( ceil(v_position), ceil(vec2(gl_FragCoord.x, v_windowSize.y - gl_FragCoord.y))  );
    if(ceil(dist)< ceil(v_size.x)) {
      gl_FragColor = vec4 (v_color.x, v_color.y, v_color.z, smoothstep( v_size.x, v_size.x-2.0, dist));  
    }else{
      discard;
    }
    return;
  }

  if (v_type>1.0 && v_type <= 2.0) {
    // rectangle
    gl_FragColor = v_color;
    return;
  }
  gl_FragColor = v_color;
  
}
`



const positions = [
  // 200, 200,
  // 200 -100, 200 -100,
  // 200 +100, 200 - 100,
  // 200,200+100,
];
const shapColor = [
  // 1 *255 ,0 *255, 0 *255,1 *255,
  // 0 *255 ,1 *255, 0 *255,1 *255,
  // 0 *255 ,0 *255, 1 *255,1 *255,
  // 1 *255 ,1 *255, 0 *255,1 *255,
]
const shapSize = [
  // 200, 0,
  // 50, 0,
  // 50, 0,
  // 80, 0,

]
const shapeType = [
  // 1,
  // 1,
  // 1,
  // 2,
]
const canvasWidth = 2400
const canvasHeight =2400
const wCount = 200
const hCount = 200

const pad = 5
const w = (canvasWidth/ wCount)-pad
const h = (canvasHeight/ hCount) - pad
for(let i =0 ; i< wCount; i++){
  for(let j = 0; j< hCount; j++ ){
    const start = {x: (w + pad) * i + 0.5 *w , y: (h + pad)* j + 0.5 *w }
    // const angle = [
    //  start.x, start.y,
    //  start.x, start.y+h,
    //  start.x + w, start.y+h  
    // ]
    const r = w * 0.5
    positions.push(start.x, start.y)
    shapColor.push(0.45,0.75,0.2,1)
    shapSize.push(r, 0)
    shapeType.push(1)

    const halfR = 0.5 * r
    positions.push(start.x -halfR , start.y)
    shapColor.push(0.25,0.45,0.2,1)
    shapSize.push(halfR, 0)
    shapeType.push(1)

    positions.push(start.x + halfR , start.y)
    shapColor.push(0.25,0.45,0.2,1)
    shapSize.push(halfR, 0)
    shapeType.push(1)

    positions.push(start.x, start.y + r)
    shapColor.push(0.8,0.15,0.2,1)
    shapSize.push(halfR, 0)
    shapeType.push(2)

  }
}

console.log('total unit', wCount * hCount * 4, 'count: ', wCount * hCount)


// const positionArray = new Float32Array(positions)




const Test = () => {
  
  const cRef= useRef<HTMLCanvasElement>(null)
  const glRef = useRef(null)

  useEffect(() => {
    if(!cRef.current) return
    const gl = glRef.current = cRef.current.getContext('webgl', { alpha: true, powerPreference: 'high-performance' })
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
    const shaderAttribuites = {
      a_position: gl.getAttribLocation(program, 'a_position'),
      a_color: gl.getAttribLocation(program, 'a_color'), 
      a_size: gl.getAttribLocation(program, 'a_size'), 
      a_type: gl.getAttribLocation(program, 'a_type'), 
    }

    



    
    gl.useProgram(program)

    const viewSize = gl.getUniformLocation(program, 'u_windowSize')
    gl.uniform2f(viewSize, gl.canvas.width, gl.canvas.height)


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positionArray = new Float32Array(positions)
    gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderAttribuites.a_position);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    // let size = 2;          // 每次迭代运行提取两个单位数据
    // let type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    // let normalize = false; // 不需要归一化数据
    // let stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    //                       // 每次迭代运行运动多少内存到下一个数据开始点
    // let offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(shaderAttribuites.a_position, 2, gl.FLOAT, false, 0, 0)

    const shapeTypeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeTypeBuffer)
    const shapeTypeArray = new Float32Array(shapeType)
    gl.bufferData(gl.ARRAY_BUFFER, shapeTypeArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderAttribuites.a_type);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    // size = 1;          // 每次迭代运行提取两个单位数据
    // type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    // normalize = false; // 不需要归一化数据
    // stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    //                       // 每次迭代运行运动多少内存到下一个数据开始点
    // offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(shaderAttribuites.a_type, 1, gl.FLOAT, false, 0, 0)

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    const colorArray = new Float32Array(shapColor)
    gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderAttribuites.a_color);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    // size = 4;          // 每次迭代运行提取两个单位数据
    // type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    // normalize = true; // 不需要归一化数据
    // stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    //                       // 每次迭代运行运动多少内存到下一个数据开始点
    // offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(shaderAttribuites.a_color, 4, gl.FLOAT, false, 0, 0)


    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
    const sizeArray = new Float32Array(shapSize)
    gl.bufferData(gl.ARRAY_BUFFER, sizeArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderAttribuites.a_size);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    // size = 2;          // 每次迭代运行提取两个单位数据
    // type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    // normalize = false; // 不需要归一化数据
    // stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    //                       // 每次迭代运行运动多少内存到下一个数据开始点
    // offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(shaderAttribuites.a_size, 2, gl.FLOAT, false, 0, 0)

    const fpsDiv = document.querySelector('#fps')
    let lastTime = performance.now()
    let frameCount = 0
    const draw = () => {
      frameCount++
      const now = performance.now()

      if(now - lastTime >=1000){
        const preFrameSeconds = (now - lastTime) * 0.001/ frameCount
        fpsDiv.innerHTML ='fps: '+ Math.round(1/preFrameSeconds)
        frameCount = 0;
        lastTime = now;
      }
      positionArray.forEach((_, ind) =>  {
        if(ind%2){
          positionArray[ind] += 1
        }
      })
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);

      gl.drawArrays(gl.POINTS, 0, positions.length * 0.5);
      requestAnimationFrame(draw)
    }
    draw()

  }, [])

  return <div style={{ backgroundColor: 'black' }} >
   <canvas ref={cRef} width={canvasWidth} height={canvasHeight} style={{ width : canvasWidth / devicePixelRatio, height: canvasHeight/devicePixelRatio}} ></canvas>
  <div 
    id="fps"
    style={{
      backgroundColor:'white',
      position: 'fixed',
      left: 0,
      top: 0,
    }}
  />
  </ div >
}



export default {
  title: 'Welcome',
  component: Test,
};

export const ToStorybook = () => <Test/>;

ToStorybook.story = {
  name: 'webgl',
};
