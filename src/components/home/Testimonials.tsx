import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

// Sample testimonials data with images
const testimonials = [
    {
        id: 1,
        quote: "Understated, but unforgettable. It feels like it was made for me.",
        author: "Emily Johnson",
        location: "New York, USA",
        image: "/home/testimonials/user_1.jpg"
    },
    {
        id: 2,
        quote: "Exactly what I've been looking for. Elegant simplicity with perfect details.",
        author: "David Chen",
        location: "London, UK",
        image: "/home/testimonials/user_2.jpg"
    },
    {
        id: 3,
        quote: "The quality exceeded my expectations. Worth every penny.",
        author: "Maria Rodriguez",
        location: "Madrid, Spain",
        image: "/home/testimonials/user_3.jpg"
    }
];

// Animation variants
const fadeVariants = {
    hidden: (direction: number) => ({
        opacity: 0,
        x: direction === 1 ? 100 : -100
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction === 1 ? -100 : 100,
        transition: {
            duration: 0.4,
            ease: "easeIn"
        }
    })
};

const imageVariants = {
    inactive: {scale: 1},
    active: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            yoyo: Infinity,
            repeatDelay: 0.8
        }
    }
};

const progressVariants = {
    empty: {width: 0},
    full: {
        width: "100%",
        transition: {
            duration: 5,
            ease: "linear"
        }
    }
};

const Testimonials: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [isPaused, setIsPaused] = useState(false);

    // Auto-rotate testimonials every 5 seconds
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    // Handle manual navigation
    const goToPrevious = () => {
        setDirection(-1);
        setActiveIndex((current) =>
            current === 0 ? testimonials.length - 1 : current - 1
        );
    };

    const goToNext = () => {
        setDirection(1);
        setActiveIndex((current) =>
            (current + 1) % testimonials.length
        );
    };

    const goToSlide = (index: number) => {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
    };

    return (
        <div
            className="bg-black text-white py-16 md:py-24 md:pb-32"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4 md:px-16 lg:px-24">
                {/* Section Title */}
                <motion.h2
                    className="uppercase text-sm tracking-wide font-medium mb-12 md:mb-16"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5}}
                >
                    OUR CUSTOMERS
                </motion.h2>
                {/* Desktop Layout (hidden on mobile) */}
                <div className="hidden md:flex items-start justify-between">
                    {/* Quote Column */}
                    <div className="w-7/12 relative">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={fadeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="relative"
                            >
                                <span
                                    className="text-6xl leading-none font-serif absolute top-0 left-0 text-gray-700">"</span>
                                <h3 className="text-4xl font-light ml-12 mb-8 leading-relaxed">
                                    {testimonials[activeIndex].quote}
                                </h3>
                                <div className="ml-12 mt-10">
                                    <motion.p
                                        className="font-medium text-lg"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.3}}
                                    >
                                        {testimonials[activeIndex].author}
                                    </motion.p>
                                    <motion.p
                                        className="text-gray-400 text-sm mt-1"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.4}}
                                    >
                                        {testimonials[activeIndex].location}
                                    </motion.p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation & Images Column */}
                    <div className="w-4/12 flex flex-col items-end">
                        {/* Navigation Controls */}
                        <div className="mb-16 flex items-center space-x-4">
                            <button
                                onClick={goToPrevious}
                                className="p-2 focus:outline-none transition-transform hover:scale-110"
                                aria-label="Previous testimonial"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </button>

                            <button
                                onClick={goToNext}
                                className="p-2 focus:outline-none transition-transform hover:scale-110"
                                aria-label="Next testimonial"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Customer Images */}
                        <div className="flex flex-col space-y-6">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    className={`rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${index === activeIndex
                                        ? "w-24 h-24 border-2 border-white"
                                        : "w-16 h-16 opacity-70 hover:opacity-90"
                                    }`}
                                    onClick={() => goToSlide(index)}
                                    whileHover={{scale: 1.1}}
                                    variants={imageVariants}
                                    animate={index === activeIndex ? "active" : "inactive"}
                                >
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Mobile Layout (hidden on desktop) */}
                <div className="md:hidden">
                    <div className="flex justify-between">
                        {/* Left content: Quote and author info */}
                        <div className="w-2/3 pr-4">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={activeIndex}
                                    custom={direction}
                                    variants={fadeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="relative"
                                >
                                    {/* Quote with quotation mark */}
                                    <div className="relative">
                                        <span
                                            className="text-5xl leading-none font-serif absolute top-0 left-0 text-gray-700">"</span>
                                        <h3 className="text-xs md:text-3xl font-light ml-8 mb-6 leading-relaxed">
                                            {testimonials[activeIndex].quote}
                                        </h3>
                                    </div>

                                    {/* Author info */}
                                    <div className="mb-4 mt-2">
                                        <p className="font-medium">{testimonials[activeIndex].author}</p>
                                        <p className="text-gray-400 text-sm mt-1">{testimonials[activeIndex].location}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress Bar */}
                            <div className="h-1 bg-gray-800 w-full mt-6 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    key={`progress-${activeIndex}`}
                                    variants={progressVariants}
                                    initial="empty"
                                    animate={isPaused ? "empty" : "full"}
                                />
                            </div>

                            {/* Navigation Controls */}
                            <div className="flex items-center mt-8 space-x-4">
                                <button
                                    onClick={goToPrevious}
                                    className="p-2 focus:outline-none transition-transform hover:scale-110"
                                    aria-label="Previous testimonial"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                <button
                                    onClick={goToNext}
                                    className="p-2 focus:outline-none transition-transform hover:scale-110"
                                    aria-label="Next testimonial"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Right content: Customer images stacked vertically */}
                        <div className="w-1/3 flex flex-col items-center justify-start space-y-4">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={`mobile-thumb-${testimonial.id}`}
                                    className={`rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${index === activeIndex
                                        ? "w-16 h-16 border-2 border-white"
                                        : "w-10 h-10 opacity-70"
                                    }`}
                                    onClick={() => goToSlide(index)}
                                    whileHover={{scale: 1.05}}
                                >
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
