"use client";
import { useEffect, useRef, useState } from "react";

export default function HomeBody() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: "slide1",
      img: "https://www.louisvuitton.com/images/is/image/lv/LV_TM_CHAPTER3_LV_RESORT_03_LVCOM_2048x1152_DI3.jpg?wid=4096",
    },
    {
      id: "slide2",
      img: "https://www.chanel.com/puls-img/c_limit,w_3200/q_auto:good,dpr_auto,f_auto/1742562117322-homepagecorpoonedesktopjpg_3240x5760.jpg",
    },
    {
      id: "slide3",
      img: "https://www.chanel.com/puls-img/c_limit,w_2880/q_auto:good,dpr_auto,f_auto/1744097455114-chancehpcorpotakeoverwwdesktopjpg_1260x2880.jpg",
    },
    {
      id: "slide4",
      img: "https://www.louisvuitton.com/images/is/image/lv/W_BC_LG_NVFISO_STILLIFE_AUG24_10_DI3.jpg?wid=4096",
    },
  ];

  // Move slides.length outside of the effect to maintain consistency
  const slidesCount = slides.length;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Auto-scroll functionality
    const interval = setInterval(() => {
      if (isPaused) return;

      // Calculate slide width from the carousel width
      const slideWidth = carousel.offsetWidth;

      // Update current slide index
      const nextSlide = (currentSlide + 1) % slidesCount;
      setCurrentSlide(nextSlide);

      // Scroll to the next slide
      carousel.scrollTo({
        left: slideWidth * nextSlide,
        behavior: "smooth",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused, slidesCount]); // Using the constant slidesCount instead of slides.length

  return (
    <div className="w-full">
      <div className="">
        <div className="relative  overflow-hidden shadow-lg">
          {/* Carousel container */}
          <div
            ref={carouselRef}
            className="carousel flex overflow-x-hidden w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                id={slide.id}
                className="carousel-item relative w-full h-[500px] flex-none"
              >
                {/* Image container */}
                <div className="relative w-full h-full">
                  <img
                    src={slide?.img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                  <div className="text-white text-center p-4 text-3xl font-bold">
                    Fresh Arrivals Online
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicator dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
