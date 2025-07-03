import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TopCarousel = () => {
  const slides = [
    {
      id: 1,
      alt: "Grand Opening Sale",
      src: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
      title: "🎉 WELCOME TO STYLEHUB! 🎉",
      subtitle: "New customers get <strong>50% OFF</strong> first order + <strong>FREE</strong> shipping!",
      cta: "CLAIM YOUR DEAL",
      bgColor: "from-fuchsia-600 to-pink-600",
      highlight: "Limited Time Offer!",
      pattern: "url('/assets/diamond-pattern.svg')",
      textColor: "text-white",
      buttonColor: "bg-white text-fuchsia-700 hover:bg-gray-100"
    },
    {
      id: 2,
      alt: "Summer Collection",
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
      title: "☀️ SUMMER VIBE SALE ☀️",
      subtitle: "Trending styles up to <strong>70% OFF</strong> - Don't miss out!",
      cta: "SHOP SUMMER LOOKS",
      bgColor: "from-amber-500 to-orange-600",
      highlight: "Hot Deals!",
      pattern: "url('/assets/wave-pattern.svg')",
      textColor: "text-white",
      buttonColor: "bg-white text-amber-700 hover:bg-gray-100"
    },
    {
      id: 3,
      alt: "Mobile App Exclusive",
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3D&auto=format&fit=crop&w=1600&q=80",
      title: "📱 APP EXCLUSIVE! 📱",
      subtitle: "Extra <strong>15% OFF</strong> when you shop via our app",
      cta: "DOWNLOAD NOW",
      bgColor: "from-indigo-600 to-blue-500",
      highlight: "App Only!",
      pattern: "url('/assets/circle-pattern.svg')",
      textColor: "text-white",
      buttonColor: "bg-white text-indigo-700 hover:bg-gray-100"
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
      }, 5000);
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
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30, 
        duration: 0.8 
      },
    },
    exit: (direction) => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.3, duration: 0.5 },
    },
  };

  const floatVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div 
      className="relative w-full h-[50vh] min-h-[400px] max-h-[90vh] overflow-hidden group"
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
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  variants={textVariants}
                  className={`max-w-2xl mx-auto sm:mx-0 text-center sm:text-left space-y-3 sm:space-y-4 ${slides[currentIndex].textColor}`}
                >
                  {/* Highlight badge with animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <span className="inline-block text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-sm font-bold rounded-full shadow-md">
                      {slides[currentIndex].highlight}
                    </span>
                  </motion.div>

                  {/* Title with responsive sizing */}
                  <motion.h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {slides[currentIndex].title}
                  </motion.h1>

                  {/* Subtitle with HTML content */}
                  <motion.p
                    className="text-lg sm:text-xl md:text-2xl font-medium max-w-lg drop-shadow-sm"
                    dangerouslySetInnerHTML={{
                      __html: slides[currentIndex].subtitle,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  />

                  {/* CTA Button with hover effects */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${slides[currentIndex].buttonColor} text-sm sm:text-base px-8 py-3 sm:px-10 sm:py-3.5 font-bold rounded-full mt-4 shadow-lg transition-all duration-300`}
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

      {/* Navigation Arrows - more visible on mobile */}
      <button
        onClick={goToPrevious}
        className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 ${
          isMobile ? 'bg-white/90' : 'bg-white/80 hover:bg-white'
        } text-gray-900 p-2 sm:p-3 rounded-full shadow-lg ${
          isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-all duration-300 z-10`}
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
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
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator - more visible and interactive */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "bg-white w-6 shadow-lg" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scrolling Indicator - only on desktop */}
      {!isMobile && (
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      )}

      {/* Progress bar for auto-advance */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-10">
        <motion.div
          key={currentIndex}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-white/80"
        />
      </div>
    </div>
  );
};

export default TopCarousel;