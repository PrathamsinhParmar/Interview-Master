import React, { useEffect, useRef } from 'react';

const HeroWave = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, imageData, data;
    const SCALE = 2; // Increased scale for performance

    const resizeCanvas = () => {
      // Get parent container dimensions
      const parent = canvas.parentElement;
      
      // Set the actual canvas internal resolution to the scaled down size
      canvas.width = Math.floor(parent.offsetWidth / SCALE);
      canvas.height = Math.floor(parent.offsetHeight / SCALE);
      
      width = canvas.width;
      height = canvas.height;
      
      imageData = ctx.createImageData(width, height);
      data = imageData.data;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const startTime = Date.now();

    const SIN_TABLE = new Float32Array(1024);
    const COS_TABLE = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const angle = (i / 1024) * Math.PI * 2;
      SIN_TABLE[i] = Math.sin(angle);
      COS_TABLE[i] = Math.cos(angle);
    }

    const fastSin = (x) => {
      let index = Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023;
      if (index < 0) index += 1024;
      return SIN_TABLE[index];
    };

    const fastCos = (x) => {
      let index = Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023;
      if (index < 0) index += 1024;
      return COS_TABLE[index];
    };

    let animationFrameId;

    const render = () => {
      const time = (Date.now() - startTime) * 0.0005;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const u_x = (2 * x - width) / height;
          const u_y = (2 * y - height) / height;

          let a = 0;
          let d = 0;

          for (let i = 0; i < 4; i++) {
            a += fastCos(i - d + time * 0.5 - a * u_x);
            d += fastSin(i * u_y + a);
          }

          const wave = (fastSin(a) + fastCos(d)) * 0.5;
          const intensity = 0.3 + 0.4 * wave;
          const baseVal = 0.05 + 0.1 * fastCos(u_x + u_y + time * 0.3);
          const tealAccent = 0.15 * fastSin(a * 1.5 + time * 0.2);

          // Deep dark theme base (#050508) with teal accents (#249E94)
          // R: extremely low, G: medium, B: medium
          const r = Math.max(0, Math.min(1, baseVal * 0.2)) * intensity;
          const g = Math.max(0, Math.min(1, baseVal * 1.2 + tealAccent * 1.5)) * intensity;
          const b = Math.max(0, Math.min(1, baseVal * 1.2 + tealAccent * 1.4)) * intensity;

          const index = (y * width + x) * 4;
          data[index] = r * 255;
          data[index + 1] = g * 255;
          data[index + 2] = b * 255;
          // Apply a radial fade out so it blends into the background nicely
          const distFromCenter = Math.sqrt(u_x * u_x + u_y * u_y);
          const alphaFade = Math.max(0, 1 - distFromCenter * 0.8);
          data[index + 3] = 255 * alphaFade * 0.5; // Max opacity 50% for subtlety
        }
      }

      ctx.putImageData(imageData, 0, 0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen'
      }} 
    />
  );
};

export default HeroWave;
