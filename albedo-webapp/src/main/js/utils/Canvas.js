import React, { useRef, useEffect } from 'react';

// inspired with https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
export default function Canvas(props) {

  const { draw, ...rest } = props;
  const canvasRef = useRef(null);
  
  function resizeCanvasToDisplaySize(canvas) {
    
    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      return true // here you can return some usefull information like delta width and delta height instead of just true
      // this information can be used in the next redraw...
    }

    return false
  }

  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    const render = () => {
      frameCount++
      resizeCanvasToDisplaySize(canvas);
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw]);
  
  return <canvas ref={canvasRef} {...rest}/>;
}