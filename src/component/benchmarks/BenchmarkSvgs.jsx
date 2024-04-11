import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import anime from 'animejs';
import { motion } from 'framer-motion';
import { animate } from 'popmotion';
import { useSprings, animated } from 'react-spring';
import mojs from "@mojs/core";
import Velocity from "velocity-animate";
import {animate as motionAnimate, stagger} from "motion"

const PARAMS = {
  from: { cx: 50, r: 40, fill: '#ff0000', cy: 70 },
  to: { cx: 130, r: 60, fill: '#0000ff' },
}

const BenchmarkSvgs = ({ animationLibrary, particles }) => {
  const itemsRef = useRef([]);

  const [springs, api] = useSprings(particles, index => ({
    to: PARAMS.to,
    from: PARAMS.from,
    config: { duration: 5000 },
    delay: index * 10,
  }));

  useEffect(() => {
    switch (animationLibrary) {
      case 'gsap':
        gsap.to(itemsRef.current, {
          attr: { cx: PARAMS.to.cx, r: PARAMS.to.r },
          duration: 5,
          fill: 'blue',
          ease: 'none',
          stagger: 0.01,
        });
        break;
      case 'animejs':
        anime({
          targets: itemsRef.current,
          ...PARAMS.to,
          duration: 5000,
          easing: 'linear',
          delay: anime.stagger(10),
        });
        break;
      case 'popmotion':
        itemsRef.current.forEach((child, i) => {
          animate({
            from: PARAMS.from,
            to: PARAMS.to,
            duration: 5000,
            elapsed: -i * 10,
            onUpdate: ({ cx, r, fill }) => {
              child.setAttribute('cx', cx);
              child.setAttribute('r', r);
              child.setAttribute('fill', fill);
            },
          });
        });
        break;
      case 'velocity-js':
        itemsRef.current.forEach((el, index) => {
          Velocity(el, {
           ...PARAMS.to
          }, {
            duration: 5000,
            delay: index * 10
          });
        })
        break;
      case 'motion':
        itemsRef.current.forEach((el, index) => {
          motionAnimate(el,
            {
              cx: PARAMS.to.cx,
              r: PARAMS.to.r,
              fill: PARAMS.to.fill
            },
            {
              duration: 5,
              delay: stagger(0.01)(index),
            }
          );
        });
        break;
      case 'mojs':
        const interpolateColor = (color1, color2, progress) => {
          // Simple hex color interpolator
          const hex = color => {
            if (color.startsWith('#')) {
              color = color.substring(1);
            }
            return parseInt(color, 16);
          };

          const lerp = (a, b, u) => {
            return (1 - u) * a + u * b;
          };

          const hex1 = hex(color1);
          const hex2 = hex(color2);

          const r = Math.floor(lerp(hex1 >> 16, hex2 >> 16, progress));
          const g = Math.floor(lerp((hex1 >> 8) & 0xff, (hex2 >> 8) & 0xff, progress));
          const b = Math.floor(lerp(hex1 & 0xff, hex2 & 0xff, progress));

          return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
        };

        itemsRef.current.forEach((el, index) => {
          if (el) {
            new mojs.Tween({
              duration: 5000,
              delay: index * 10,
              onUpdate: (progress) => {
                const cx = PARAMS.from.cx + (PARAMS.to.cx - PARAMS.from.cx) * progress;
                const r = PARAMS.from.r + (PARAMS.to.r - PARAMS.from.r) * progress;
                const fill = interpolateColor(PARAMS.from.fill, PARAMS.to.fill, progress);
                el.setAttribute('fill', fill);
                el.setAttribute('cx', cx);
                el.setAttribute('r', r);
              }
            }).play();
          }
        });
        break;
      case 'framer-motion':
        // Framer Motion animates CSS properties and not SVG attributes
        break;
      case 'react-spring':
        api.start(i => ({
          to: PARAMS.to,
          from: PARAMS.from,
          delay: i * 10,
        }));
        break;
    }
  }, [animationLibrary, api]);

  let particleDivs = [];
  if (animationLibrary === 'react-spring') {
    particleDivs = springs.map((props, index) => (
      <animated.circle
        key={index}
        cx={props.cx}
        cy={PARAMS.from.cy}
        fill={props.fill}
        r={props.r}
      />
    ));
  } else if (animationLibrary === 'framer-motion') {
    particleDivs = Array.from({ length: particles }, (_, i) => (
      <motion.circle
        key={i}
        animate={{
          cx: PARAMS.to.cx,
          r: PARAMS.to.r,
          fill: PARAMS.to.fill,
          transition: {
            duration: 5,
            ease: 'linear',
            delay: i * 0.01,
          },
        }}
        cy={PARAMS.from.cy}
        cx={PARAMS.from.cx}
        r={PARAMS.from.r}
        fill={PARAMS.from.fill}
      />
    ));
  } else {
    particleDivs = Array.from({ length: particles }, (_, i) => (
      <circle
        ref={el => itemsRef.current[i] = el}
        key={i}
        cy={PARAMS.from.cy}
        cx={PARAMS.from.cx}
        r={PARAMS.from.r}
        fill={PARAMS.from.fill}
      />
    ));
  }

  return (
    <svg className="benchmark" viewBox="0 0 200 800">
      {particleDivs}
    </svg>
  );
};

export default BenchmarkSvgs;
