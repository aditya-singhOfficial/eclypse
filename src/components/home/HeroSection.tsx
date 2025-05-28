"use client";
import React, {useEffect, useRef} from "react";
import {motion} from "framer-motion";
import videoFallback from "/home/hero-poster.png";
import video from "/hero.mp4";
import LogoText from "../../assets/logo-text.svg";
import ViewTransitionLink from "../ViewTransitionLink";

const HeroSection: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const vid = videoRef.current;
        if (vid) {
            vid.muted = true;
            const playPromise = vid.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Hero video play prevented:", err);
                });
            }
        }
    }, []);

    const textVariants = {
        hidden: {opacity: 0, y: 20},
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3 + i * 0.2,
                duration: 0.8,
                ease: "easeOut",
            },
        }),
    };

    return (
        <div className="relative overflow-hidden bg-black text-white">
            {/* push content down just enough for your navbar height */}
            <div className="pt-24 sm:pt-28 md:pt-32 lg:pt-36"/>

            {/* Brand & Year */}
            <div className="flex flex-row justify-between items-center px-4 sm:px-6 md:px-12 lg:px-16 mb-8">
                <motion.img
                    src={LogoText}
                    alt="Eclypse Logo Text"
                    loading="lazy"
                    className="
      w-24        /* 5rem (80px) on xs */
      sm:w-28     /* 6rem (96px) on sm */
      md:w-40     /* 8rem (128px) on md */
      lg:w-56     /*10rem (160px) on lg+ */
      h-auto      /* keep aspect ratio */
    "
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        bounce: 0.3,
                        duration: 0.8,
                        delay: 0.2,
                    }}
                />

                <motion.div
                    className="mt-4 md:mt-0 text-2xl sm:text-3xl lg:text-4xl font-light"
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        bounce: 0.3,
                        duration: 0.8,
                        delay: 0.4,
                    }}
                >
                    <span className="font-normal">&copy; {new Date().getFullYear()}</span>
                </motion.div>
            </div>


            {/* Video */}
            <div className="px-4 sm:px-6 md:px-12 lg:px-16 mb-12">
                <div className="aspect-video w-full rounded-lg shadow-lg overflow-hidden">
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
                        <source src={video} type="video/mp4"/>
                        Your browser doesn’t support background video.
                    </video>
                </div>
            </div>

            {/* Description + Link */}
            <div className="px-4 sm:px-6 md:px-12 lg:px-16 pb-12">
                <motion.div
                    className="max-w-2xl"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.3}}
                >
                    <motion.p
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-6 tracking-[-2%]"
                        variants={textVariants}
                        custom={0}
                    >
                        Rooted in a philosophy of quiet luxury, our garments are designed to
                        speak softly in cut, in movement, in presence.
                    </motion.p>

                    <motion.div variants={textVariants} custom={1}>
                        <ViewTransitionLink
                            to="/about"
                            className="inline-flex items-center text-lg sm:text-xl border-b border-white pb-1 transition-colors hover:text-gray-300"
                        >
                            Learn more about Eclypse
                            <svg
                                className="ml-2 w-8 h-8 transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 31 31"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.9927 20.0076L20.0284 10.9719"
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10.9927 10.972H20.0284V20.0077"
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>


                        </ViewTransitionLink>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
