"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import videoFallback from '../../assets/videos/hero-poster.png';
import video from '../../../public/hero.mp4';
import LogoText from '../../assets/logo-text.svg';
import ViewTransitionLink from '../ViewTransitionLink';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Hero video play prevented:', err);
        });
      }
    }
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.2,
        duration: 0.8,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="min-h-screen bg-black flex flex-col mt-36 md:mt-40 lg:mt-44 relative overflow-hidden">
      {/* Brand Name & Year */}
      <div className="flex justify-between items-start px-6 md:px-12 lg:px-16 py-0 mb-3">
        <motion.img
          className="text-5xl sm:text-6xl lg:text-7xl text-white font-extralight tracking-normal leading-none"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            bounce: 0.3,
            duration: 0.8,
            delay: 0.2,
          }}
          src={LogoText}
          alt="Eclypse Logo Text"
          width={300}
          height={100}
          loading="lazy"
        />

        <motion.div
          className="text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-tight mt-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            bounce: 0.3,
            duration: 0.8,
            delay: 0.4,
          }}
        >
          <span className="text-4xl sm:text-5xl lg:text-3xl font-bold">
            &copy;&nbsp;{new Date().getFullYear()}
          </span>
        </motion.div>
      </div>

      {/* Video Container with margins */}
      <div className="px-6 my-14 md:px-12 lg:px-16">
        <div className="aspect-video w-full h-169 relative overflow-hidden rounded-lg shadow-lg">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={videoFallback}
          >
            <source src={video} type="video/mp4" />
            Your browser doesn't support background video.
          </video>
        </div>
      </div>

      {/* Bottom Content - Description and Link */}
      <div className="flex-1 px-6 md:px-12 lg:px-16 pt-10 md:pt-12 pb-8 md:pb-10">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            className="text-2xl md:text-4xl text-white font-medium leading-tight mb-6 md:mb-8"
            variants={textVariants}
            custom={0}
          >
            Rooted in a philosophy of quiet luxury, our garments are designed to
            speak softly in cut, in movement, in presence.
          </motion.p>

          <motion.div variants={textVariants} custom={1} className="inline-block">
            <ViewTransitionLink
              to="/about"
              className="text-white border-b border-white py-0.5 inline-flex items-center group transition-colors duration-300 hover:text-gray-300"
            >
              Learn more about Eclypse
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </ViewTransitionLink>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;