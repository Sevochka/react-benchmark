import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from "gsap/PixiPlugin";
import anime from 'animejs';
import { animate } from 'popmotion';

// Register the GSAP plugin
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const BenchmarkPixi = ({ particles, animationLibrary }) => {
  const pixiContainer = useRef(null);
  const appRef = useRef(null);

  const animateWithGsap = (container) => {
    gsap.to(container.children, {
      duration: 3,
      pixi: { x: 400, y: 300, rotation: 360, alpha: 0 }
    });
  };

  const animateWithAnime = (container) => {
    container.children.forEach(child => {
      // anime({
      //   targets: child.position,
      //   x: 400,
      //   y: 300,
      // });

      anime({
        targets: child.rotation,
        rotation: 360,
      });
    })
  };

  const animateWithPopmotion = (container) => {
    container.children.forEach(child => {
      animate({
        from: { x: child.x, y: child.y, rotation: 0, opacity: 1 },
        to: { x: 400, y: 300, rotation: 360, opacity: 0 },
        duration: 3000,
        onUpdate: latest => {
          child.x = latest.x;
          child.y = latest.y;
          child.rotation = latest.rotation;
          child.alpha = latest.opacity;
        }
      });
    });
  };

  const renderBunnies = async () => {
    await sleep(0);
    // Create a new PIXI Application
    // Create a new application
    const app = new PIXI.Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // appRef.current = app;
    pixiContainer.current.appendChild(app.canvas);

    const container = new PIXI.Container();
    app.stage.addChild(container);

    // Load the bunny texture
    const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');

    // Create bunnies
    for (let i = 0; i < particles; i++) {
      const bunny = new PIXI.Sprite(texture);
      bunny.x = Math.random() * app.screen.width;
      bunny.y = Math.random() * app.screen.height;
      container.addChild(bunny);
    }

    // Center the container
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    // Choose animation library
    switch (animationLibrary) {
      case 'gsap':
        animateWithGsap(container);
        break;
      case 'animejs':
        animateWithAnime(container);
        break;
      case 'popmotion':
        animateWithPopmotion(container);
        break;
      default:
        console.log('No animation library selected');
    }
  };


  useEffect(() => {
    renderBunnies();
  }, [particles, animationLibrary]);

  return <div ref={pixiContainer} />;
};

export default BenchmarkPixi;
