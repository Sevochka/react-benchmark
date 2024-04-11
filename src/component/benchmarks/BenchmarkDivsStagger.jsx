import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import anime from 'animejs';
import { motion } from 'framer-motion';
import {animate, linear} from 'popmotion';
import { useSprings, animated } from 'react-spring';
import './BenchmarkDivs.scss';
import Velocity from "velocity-animate";
import mojs from "@mojs/core";
import {animate as motionAnimate, stagger} from "motion"

const BenchmarkDivs = ({ animationLibrary, particles }) => {
    const itemsRef = useRef([]);

    const [springs] = useSprings(particles, index => ({
        from: { x: 0, scale: 1, opacity: 1 },
        to: { x: 200, scale: 2, opacity: 0.5 },
        config: { duration: 20000 },
        delay: index * 10,
    }));


    useEffect(() => {
        switch (animationLibrary) {
            case 'gsap':
                gsap.ticker.lagSmoothing(false)
                gsap.to(itemsRef.current, {
                    x: 200,
                    ease: 'none',
                    duration: 20,
                    scale: 2,
                    opacity: 0.5,
                    stagger: 0.01,
                  }
                );
                break;
            case 'animejs':
                anime({
                    targets: itemsRef.current,
                    translateX: 200,
                    scale: 2,
                    opacity: 0.5,
                    duration: 20000,
                    easing: 'linear',
                    delay: anime.stagger(10),
                });
                break;

            case 'motion':
                motionAnimate('.benchmark__item',
                  {  x: 200, scale: 2,  opacity: 0.5, },
                  { delay: stagger(0.1), duration: 20},
                        { easing: "linear" }
                )
                break;
            case 'velocity-js':
                itemsRef.current.forEach((el, index) => {
                    Velocity(el, {
                        translateX: 200,
                        scale: 2,
                        opacity: 0.5
                    }, {
                        duration: 20000,
                        delay: index * 10
                    });
                })
                break;
            case 'popmotion':
                itemsRef.current.forEach((child, i) => {
                    animate({
                        from: { x: 0, scale: 1, opacity: 1 },
                        to: { x: 200, scale: 2, opacity: 0.5 },
                        duration: 20000,
                        ease: linear,
                        elapsed: -i * 10,
                        onUpdate: v => {
                            child.style.transform = `translateX(${v.x}px) scale(${v.scale})`;
                            child.style.opacity = v.opacity;
                        }
                    });
                });
                break;

            case 'mojs':
                const timeline = new mojs.Timeline();
                itemsRef.current.forEach((el, index) => {
                    if (el) { // Check if the element is not null
                        const tween = new mojs.Html({
                            el: el,
                            x: { 0: 200 },
                            scale: { 1: 2 },
                            opacity: { 1: 0.5 },
                            duration: 20000,
                            delay: index * 10,
                        });
                        timeline.add(tween);
                    }
                });
                timeline.play();
                break;
            case 'react-spring':
                // This is already handled by the useSprings hook above
                break;
          // Add other cases for additional libraries
        }
    }, [animationLibrary]);let particleDivs = [];
    if (animationLibrary === 'react-spring') {
        particleDivs = springs.map((animation, index) => (
          <animated.div
            key={index}
            style={animation}
            className="benchmark__item"></animated.div>
        ))
    } else {
        particleDivs = Array.from({ length: particles }, (_, i) => {
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
                                duration: 20,
                                ease: "linear",
                                delay: i * 0.01
                            }
                        }}
                        className="benchmark__item"
                      />
                    );
                case 'react-spring':
                    return (
                      <div>
                          {springs.map((animation, index) => (
                            <animated.div
                              key={index}
                              style={animation}
                              className="benchmark__item"></animated.div>
                          ))}
                      </div>
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
    }


    return (
      <div className="benchmark">
          <div className="benchmark__items">
              {particleDivs}
          </div>
      </div>
    );
};

export default BenchmarkDivs;
