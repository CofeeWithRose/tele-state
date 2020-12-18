import React, { useEffect, useRef } from 'react';
import { GLRender, GL_ELEMENT_TYPES } from '../lib'



const canvasWidth = 1400
const canvasHeight = 800

function Test() {
    const cRef = useRef()

    useEffect(() =>{
        const glRender = new GLRender(cRef.current)
        const c = document.createElement('canvas')
        const ctx = c.getContext('2d')
        ctx.fillStyle= "white"
        ctx.strokeStyle = 'black'
        ctx.arc(50,50,50,0,  Math.PI *2)
        ctx.fill()
        ctx.stroke()
        
        const [imgId] = glRender.loadImgs([c])
        const glImg = glRender.createElement(GL_ELEMENT_TYPES.GL_IMAGE, { imgId, position: {x: 0, y:0} })

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