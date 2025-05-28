import React, {type JSX, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import ViewTransitionLink from "./ViewTransitionLink.tsx";

const navLinks = [
    {label: "Home", href: "/"},
    {label: "About", href: "/about"},
    {label: "Buy", href: "/buy"},
    {label: "Our Customers", href: "/customers"},
    {label: "Contacts", href: "/contacts"},
];

const Footer = (): JSX.Element => {
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    return (
        <footer className="bg-[#090808] w-full border-t border-[#232323] px-2 sm:px-4 md:px-12 py-6">
            <div className="max-w-[1340px] mx-auto w-full flex flex-col gap-2 relative">
                {/* Row 1: Logo */}
                <div className="w-full flex justify-start mb-2">
                    <motion.img
                        src="/logo-text.svg"
                        alt="Eclypse Logo"
                        className="w-24 h-auto"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, ease: "easeInOut"}}
                    />
                </div>

                {/* Row 2: single row on mobile, wrap on md+ */}
                <div className="
    w-full
    flex flex-row flex-nowrap md:flex-wrap
    items-center md:items-end
    justify-between
    gap-2 md:gap-0
    text-[9px] sm:text-xs md:text-sm
  ">
                    {/* Navigation Links */}
                    <nav className="flex-1 min-w-0 flex flex-col justify-center md:items-start">
                        <div className="flex flex-wrap items-center text-[#d3d5d8] font-medium">
                            {navLinks.slice(0, 3).map((link, idx) => (
                                <React.Fragment key={link.label}>
                                    <ViewTransitionLink
                                        to={link.href}
                                        className="hover:text-white transition-colors whitespace-nowrap px-0.5"
                                    >
                                        {link.label}
                                    </ViewTransitionLink>
                                    {idx < 2 && <span className="mx-1 opacity-40">/</span>}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center text-[#d3d5d8] font-medium">
                            <ViewTransitionLink
                                to={navLinks[3].href}
                                className="hover:text-white transition-colors whitespace-nowrap px-0.5"
                            >
                                {navLinks[3].label}
                            </ViewTransitionLink>
                            <span className="mx-1 opacity-40">/</span>
                            <ViewTransitionLink
                                to={navLinks[4].href}
                                className="hover:text-white transition-colors whitespace-nowrap px-0.5"
                            >
                                {navLinks[4].label}
                            </ViewTransitionLink>
                        </div>
                    </nav>

                    {/* Contact & Email */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
    <span className="uppercase font-medium text-[#d3d5d8] opacity-60 tracking-[1.2px]">
      Contact
    </span>
                        <a
                            href="tel:+911234567890"
                            className="font-medium text-[#d3d5d8] tracking-tight leading-5 hover:text-white transition-colors"
                        >
                            +91 123-456-7890
                        </a>
                        <span className="uppercase font-medium text-[#d3d5d8] opacity-60 tracking-[1.2px] mt-1">
      Email
    </span>
                        <a
                            href="mailto:eclypse@gmail.com"
                            className="hover:text-white transition-colors"
                        >
                            eclypse@gmail.com
                        </a>
                    </div>

                    {/* Copyright & Scroll to Top */}
                    <div className="flex-1 min-w-0 flex flex-col items-center md:items-end">
                        <AnimatePresence>
                            {showScrollButton && (
                                <motion.button
                                    initial={{opacity: 0, scale: 0.8}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.8}}
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    onClick={scrollToTop}
                                    className="fixed bottom-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-50 cursor-pointer"
                                    aria-label="Scroll to top"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 15,
                                    }}
                                >
                                    <svg
                                        className="w-5 h-5 text-black"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 19V5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5 12L12 5L19 12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <p className="opacity-60 font-normal whitespace-nowrap flex items-center mt-4 md:mt-0">
                            <span className="font-normal">©</span>
                            <span className="font-medium ml-0.5">Eclypse 2025</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
