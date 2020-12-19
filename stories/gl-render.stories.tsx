import React, { useEffect, useRef } from 'react';
import { GLRender, GL_ELEMENT_TYPES } from '../lib'
import { GlImage } from '../lib/GLElement/GLImage';



const canvasWidth = 1400
const canvasHeight = 800

function Test() {
    const cRef = useRef()

    useEffect(() =>{
        const glRender = new GLRender(cRef.current)
        const circle = document.createElement('canvas')
        circle.width = 100
        circle.height = 100
        const ctx = circle.getContext('2d')
        ctx.fillStyle= "red"
        ctx.arc(50,50,50,0,  Math.PI *2)
        ctx.fill()

        
        const [circleImgId] = glRender.loadImgs([circle])

        ctx.clearRect(0,0, 100, 100)
        ctx.fillStyle= "green"
        ctx.arc(50,50,50,0,  Math.PI)
        ctx.fill()

        const [halfImgId] = glRender.loadImgs([circle])
        
        const xCount = 20
        const yCount = 50
        const imgList:GlImage[] = []
        for(let i =0; i< xCount; i++){
          for( let j =0; j< yCount; j++ ){
            imgList.push ( 
              glRender.createElement(
                GL_ELEMENT_TYPES.GL_IMAGE, 
                { 
                  imgId: imgList.length%2? circleImgId : halfImgId, 
                  position: {x: i *150 + 5 , y: j * 150 +5} 
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
    // style={{ backgroundColor: 'black' }} 
    return <div >
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
    title: 'GL RENDER',
    component: Test,
  };
  
  export const ToStorybook = () => <Test/>;
  
  ToStorybook.story = {
    name: 'webgl',
  };