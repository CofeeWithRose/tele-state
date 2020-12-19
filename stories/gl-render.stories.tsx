import React, { useEffect, useRef } from 'react';
import { GLRender, GL_ELEMENT_TYPES } from '../lib'
import { GlImage } from '../lib/GLElement/GLImage';



const canvasWidth = 1920
const canvasHeight = 969

const circleR = 10

function Test() {
    const cRef = useRef()

    const textureRef = useRef<HTMLCanvasElement>()

    const glRenderRef  =  useRef<GLRender>()

    useEffect(() =>{
        const glRender = new GLRender(cRef.current)
        glRenderRef.current = glRender
        const circle = document.createElement('canvas')
        circle.width = circleR *2
        circle.height = circleR *2
        const ctx = circle.getContext('2d')
        ctx.fillStyle= "black"
        ctx.arc(circleR, circleR, circleR,0,  Math.PI *2)
        ctx.fill()

        
        const [circleImgId] = glRender.loadImgs([circle])

        ctx.clearRect(0,0, circleR *2, circleR *2)
        ctx.fillStyle= "#a0a0a0"
        ctx.arc(circleR, circleR, circleR, 0,  Math.PI *2 )
        ctx.fill()

        const [halfImgId] = glRender.loadImgs([circle])
        
        const xCount = 200
        const yCount = 50
        
        const imgList:GlImage[] = []
        for(let i =0; i< xCount; i++){
          for( let j =0; j< yCount; j++ ){
            imgList.push ( 
              glRender.createElement(
                GL_ELEMENT_TYPES.GL_IMAGE, 
                { 
                  imgId: imgList.length%3? circleImgId : halfImgId, 
                  position: {x: i *circleR *2  , y: j * circleR *2} 
                }
              ) 
            )
          }
        }

        const fpsDiv = document.querySelector('#fps')
        let lastTime = performance.now()
        let frameCount = 0
          
        const req = () => {
          frameCount++
          const now = performance.now()
    
          if(now - lastTime >=1000){
            const preFrameSeconds = (now - lastTime) * 0.001/ frameCount
            fpsDiv.innerHTML ='fps: '+ Math.round(1/preFrameSeconds)
            frameCount = 0;
            lastTime = now;
          }

          imgList.forEach( e => e.setPosition( e.position.x+0.1, e.position.y + 0.1 ) )
          requestAnimationFrame(req)
        }
        req()

    }, [])

    useEffect(() => {
      const ctx = textureRef.current.getContext('2d')
      ctx.drawImage( glRenderRef.current.getTexture(), 0,0, 200,200, 0,0, 200,200 )
    }, [])

    // style={{ backgroundColor: 'black' }} 
    return <div >
      <canvas ref={textureRef} width={200} height={200} style={{backgroundColor:'rgb(122,122,122,1)'}} ></canvas>
      <canvas ref={cRef} width={canvasWidth} height={canvasHeight} 
        style={{ 
          width : canvasWidth / devicePixelRatio, 
          height: canvasHeight/devicePixelRatio,
          backgroundColor: 'rgb(122,122,122,1)'
        }} />
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
    title: 'GL RENDER',
    component: Test,
  };
  
  export const ToStorybook = () => <Test/>;
  
  ToStorybook.story = {
    name: 'webgl',
  };