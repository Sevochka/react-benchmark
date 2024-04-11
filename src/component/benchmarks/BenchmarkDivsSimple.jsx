import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import anime from 'animejs';
import { motion } from 'framer-motion';
import { animate, linear } from 'popmotion';
import { useSpring, animated } from 'react-spring';
import './BenchmarkDivs.scss';

const BenchmarkDivs = () => {
  const particlesCount = 1000;
  const [searchParams] = useSearchParams();
  const animationLibrary = searchParams.get('library');
  const itemsRef = useRef([]);

  const spring = useSpring({
    from: { x: 0, scale: 1, opacity: 1 },
    to: { x: 200, scale: 2, opacity: 0.5 },
    config: { duration: 5000 },
  });

  useEffect(() => {
    const animateItems = {
      x: 200,
      scale: 2,
      opacity: 0.5,
      duration: 5000,
    };

    if (itemsRef.current.length === 0) return;


    switch (animationLibrary) {
      case 'gsap':
        gsap.to(itemsRef.current, {
          x: 200,
          scale: 2,
          opacity: 0.5,
          duration: 5,
          ease: 'linear'
        });
        break;
      case 'animejs':
        anime({
          targets: itemsRef.current,
          translateX: animateItems.x,
          scale: animateItems.scale,
          opacity: animateItems.opacity,
          duration: animateItems.duration,
          easing: 'linear',
        });
        break;
      case 'popmotion':
        itemsRef.current.forEach(child => {
          animate({
            from: { x: 0, scale: 1, opacity: 1 },
            to: { x: 200, scale: 2, opacity: 0.5 },
            duration: 5000,
            ease: linear,
            onUpdate: latest => {
              child.style.transform = `translateX(${latest.x}px) scale(${latest.scale})`;
              child.style.opacity = latest.opacity;
            }
          });
        });
        break;
      case 'react-spring':
        // Handled by the useSpring hook
        break;
      // Add other cases for additional libraries if needed
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
              }
            }}
            className="benchmark__item"
          />
        );
      case 'react-spring':
        return (
          <animated.div
            key={i}
            style={spring}
            className="benchmark__item"
          />
        );
      default:
        return (
          <div
            ref={el => itemsRef.current[i] = el}
            key={i}
            className={`benchmark__item ${animationLibrary === 'css' ? 'benchmark__item--transition' : ''}`}
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
