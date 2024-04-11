import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import anime from 'animejs';
import { motion } from 'framer-motion';
import { animate } from 'popmotion';
import { Velocity } from 'velocity-animate';
import { useSprings, animated } from 'react-spring';
import mojs from '@mojs/core'
import './BenchmarkDivs.scss';

const BenchmarkDivs = () => {
  const particlesCount = 1000;
  const [searchParams] = useSearchParams();
  const animationLibrary = searchParams.get('library');
  const itemsRef = useRef([]);

  const [springs, setSprings] = useSprings(particlesCount, i => ({
    from: { x: 0, scale: 1, opacity: 1 },
    to: { x: 200, scale: 2, opacity: 0.5 },
    config: { duration: 5000 },
    delay: i * 10,
  }));

  useEffect(() => {
    switch (animationLibrary) {
      case 'gsap':
        gsap.to(itemsRef.current, {
          x: 200,
          duration: 5,
          scale: 2,
          opacity: 0.5,
          stagger: 0.01,
        });
        break;
      case 'animejs':
        anime({
          targets: itemsRef.current,
          translateX: 200,
          scale: 2,
          opacity: 0.5,
          duration: 5000,
          easing: 'linear',
          delay: anime.stagger(10),
        });
        break;
      case 'popmotion':
        itemsRef.current.forEach((child, i) => {
          animate({
            from: { x: 0, scale: 1, opacity: 1 },
            to: { x: 200, scale: 2, opacity: 0.5 },
            duration: 5000,
            ease: 'linear',
            delay: i * 10,
            onUpdate: v => {
              child.style.transform = `translateX(${v.x}px) scale(${v.scale})`;
              child.style.opacity = v.opacity;
            }
          });
        });
        break;
      case 'mojs':
        console.log(1)
        const timeline = new mojs.Timeline();
        itemsRef.current.forEach((child, i) => {
          const tween = new mojs.Html({
            el: child,
            x: 200,
            scale: 2,
            opacity: 0.5,
            duration: 5000,
            delay: i * 10,
            easing: 'linear',
          });
          timeline.add(tween);
        });
        timeline.play();
        break;
      case 'velocity-js':
        Velocity(itemsRef.current, {
          translateX: 200,
          scale: 2,
          opacity: 0.5
        }, {
          duration: 5000,
          delay: (_, i) => i * 10
        });
        break;
      case 'react-spring':
        // This is already handled by the useSprings hook above
        break;
      // Add other cases for additional libraries
    }
  }, [animationLibrary]);

  const particleDivs = Array.from({ length: particlesCount }, (_, i) => {
    switch (animationLibrary) {
      case 'framer-motion':
        return (
          <motion.div
            key={i}
            animate={{
              x: 200,
              scale: 2,
              opacity: 0.5,
              transition: {
                duration: 5,
                ease: "linear",
                delay: i * 0.01
              }
            }}
            className="benchmark__item"
          />
        );
      case 'react-spring':
        return (
          <animated.div
            key={i}
            style={{
              transform: springs[i].x.to(x => `translateX(${x}px)`).concat(springs[i].scale.to(scale => ` scale(${scale})`)),
              opacity: springs[i].opacity,
            }}
            className="benchmark__item"
          />
        );
      default:
        return (
          <div
            ref={el => itemsRef.current[i] = el}
            key={i}
            className="benchmark__item"
          />
        );
    }
  });

  return (
    <div className="benchmark">
      <div className="benchmark__items">
        {particleDivs}
      </div>
    </div>
  );
};

export default BenchmarkDivs;

