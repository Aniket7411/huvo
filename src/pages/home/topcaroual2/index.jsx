import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TopCarousel2 = () => {
  const slides = [
    {
      id: 1,
      alt: "Grand Opening Sale",
      src: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
      title: "🎉 WELCOME TO HUVO! 🎉",
      subtitle: "New customers get <strong>50% OFF</strong> first order + <strong>FREE</strong> shipping!",
      cta: "SHOP NOW",
      bgColor: "from-fuchsia-600 to-pink-600",
      highlight: "Limited Time Offer!",
      buttonColor: "bg-white text-fuchsia-700 hover:bg-gray-50",
      textPosition: "sm:items-center sm:text-center" // Center on larger screens
    },
    {
      id: 2,
      alt: "Summer Collection",
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
      title: "☀️ SUMMER SALE IS HERE ☀️",
      subtitle: "Trending styles up to <strong>70% OFF</strong> - Shop before they're gone!",
      cta: "EXPLORE COLLECTION",
      bgColor: "from-amber-500 to-orange-600",
      highlight: "Hot Deals!",
      buttonColor: "bg-white text-amber-700 hover:bg-gray-50",
      textPosition: "sm:items-end sm:text-right" // Right aligned on larger screens
    },
    {
      id: 3,
      alt: "Exclusive Online Deals",
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3D&auto=format&fit=crop&w=1600&q=80",
      title: "🛍️ ONLINE EXCLUSIVES 🛍️",
      subtitle: "Extra <strong>20% OFF</strong> when you spend $100+",
      cta: "VIEW DEALS BELOW",
      bgColor: "from-indigo-600 to-blue-500",
      highlight: "Web Only!",
      buttonColor: "bg-white text-indigo-700 hover:bg-gray-50",
      textPosition: "sm:items-start sm:text-left" // Left aligned on larger screens
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        goToNext();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered]);

  const goToPrevious = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Animation variants
  const slideVariants = {
    hidden: (direction) => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0.5,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30, 
        duration: 0.7 
      },
    },
    exit: (direction) => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.3, duration: 0.6 },
    },
  };

  return (
    <div 
      className="relative w-full h-[60vh] min-h-[450px] max-h-[800px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slides[currentIndex].id}
          custom={direction}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute w-full h-full"
        >
          <div className="relative w-full h-full">
            {/* Background image with overlay */}
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <img
              src={slides[currentIndex].src}
              alt={slides[currentIndex].alt}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />

            {/* Content container */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentIndex].bgColor} bg-opacity-90 flex items-center`}>
              <div className="container mx-auto px-6 sm:px-8 lg:px-10">
                <motion.div
                  variants={textVariants}
                  className={`max-w-2xl mx-auto flex flex-col ${slides[currentIndex].textPosition} space-y-4 sm:space-y-6 text-white`}
                >
                  {/* Highlight badge */}
                  {/* <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block text-xs sm:text-sm px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 font-bold rounded-full shadow-lg"
                  >
                    {slides[currentIndex].highlight}
                  </motion.span> */}

                  {/* Title */}
                  <motion.h1 
                    className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {slides[currentIndex].title}
                  </motion.h1>

                  {/* Subtitle */}
                  {/* <motion.p
                    className="text-lg sm:text-xl md:text-2xl font-medium max-w-lg drop-shadow-sm"
                    dangerouslySetInnerHTML={{
                      __html: slides[currentIndex].subtitle,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  /> */}

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 8px 25px -8px rgba(255,255,255,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className={`${slides[currentIndex].buttonColor} text-sm sm:text-base px-8 py-3 sm:px-10 sm:py-4 font-bold rounded-full mt-2 shadow-xl transition-all duration-300`}
                    >
                      {slides[currentIndex].cta}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 ${
          isMobile ? 'bg-white/90' : 'bg-white/80 hover:bg-white'
        } text-gray-900 p-2 sm:p-3 rounded-full shadow-lg ${
          isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-all duration-300 z-10`}
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 ${
          isMobile ? 'bg-white/90' : 'bg-white/80 hover:bg-white'
        } text-gray-900 p-2 sm:p-3 rounded-full shadow-lg ${
          isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-all duration-300 z-10`}
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "bg-white w-8 shadow-lg" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 z-10 bg-white/20">
        <motion.div
          key={currentIndex}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-white/90"
        />
      </div>
    </div>
  );
};

export default TopCarousel2;