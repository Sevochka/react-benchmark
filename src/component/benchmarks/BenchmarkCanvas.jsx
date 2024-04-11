import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import anime from 'animejs';
import { animate, linear } from 'popmotion';
import { useSprings } from 'react-spring';
import Velocity from "velocity-animate";
import { animate as framerAnimate } from 'framer-motion';
import mojs from "@mojs/core";
import {animate as motionAnimate, stagger} from "motion"


const BenchmarkCanvas = ({ animationLibrary, particles }) => {
  const canvasRef = useRef(null);

  function createParticles(particleCount, canvasRef) {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvasRef.current.width;
      const y = Math.random() * canvasRef.current.height;

      particles.push({
        x: x,
        originalX: x,
        y: y,
        scale: 1,
        opacity: 1,
      });
    }
    return particles;
  }

  function drawParticles(canvasRef, particles) {
    console.log(canvasRef)
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 5 * particle.scale, 0, Math.PI * 2);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.restore();
    });
  }

  useEffect(() => {
    const particlesArray = createParticles(particles, canvasRef);
    drawParticles(canvasRef, particlesArray);

    switch (animationLibrary) {
      case 'gsap':
        gsap.to(particlesArray, {
          x: 200,
          scale: 2,
          opacity: 0.5,
          duration: 5,
          ease: 'none',
          onUpdate: () => drawParticles(canvasRef, particlesArray)
        });
        break;
      case 'animejs':
        anime({
          targets: particlesArray,
          x: 200,
          scale: 2,
          opacity: 0.5,
          duration: 5000,
          easing: 'linear',
          update: () => drawParticles(canvasRef, particlesArray)
        });
        break;
      case 'motion':
        particlesArray.forEach(particle => {
          motionAnimate(
            progress => { // `progress` goes from 0 to 1 over the duration
              // Update particle properties based on progress
              particle.x = particle.originalX + (200 - particle.originalX) * progress;
              particle.scale = 1 + 1 * progress; // scale from 1 to 2
              particle.opacity = 1 - 0.5 * progress; // opacity from 1 to 0.5

              // Redraw particles
              drawParticles(canvasRef, particlesArray);
            },
            { duration: 5 }
          );
        });
        break;
      case 'popmotion':
        particlesArray.forEach((particle, index) => {
          animate({
            from: { x: 0, scale: 1, opacity: 1 },
            to: { x: 200, scale: 2, opacity: 0.5 },
            duration: 5000,
            ease: linear,
            elapsed: index * 10,
            onUpdate: latest => {
              particle.x = latest.x;
              particle.scale = latest.scale;
              particle.opacity = latest.opacity;
              drawParticles(canvasRef, particlesArray);
            }
          });
        });
        break;
      case 'mojs':
        particlesArray.forEach((particle, index) => {
          new mojs.Tween({
            repeat: 0,
            delay: index * 10,
            duration: 5000,
            onUpdate: (progress) => {
              // Calculate the next position and properties based on progress
              particle.x = particle.originalX + (200 - particle.originalX) * progress;
              particle.scale = 1 + (1 * progress); // scale from 1 to 2
              particle.opacity = 1 - 0.5 * progress; // opacity from 1 to 0.5

              // Redraw particles
              drawParticles(canvasRef, particlesArray);
            }
          }).play();
        });
        break;
      default:
        break;
    }
  }, [animationLibrary, particles]);

  return (
    <div className="benchmark">
      <canvas ref={canvasRef} width="800" height="600" className="benchmark__canvas"></canvas>
    </div>
  );
};


export default BenchmarkCanvas;
