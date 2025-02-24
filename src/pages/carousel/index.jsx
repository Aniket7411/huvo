import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SimpleSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false, // Remove arrows for cleaner UI, optional
    };

    const slides = [
        {
            imgSrc: "https://asset.cloudinary.com/viplav2411/843cee27f5b9ade3c6c589e97b0181b1",
            caption: "Slide 1",
        },
        {
            imgSrc: "https://asset.cloudinary.com/viplav2411/843cee27f5b9ade3c6c589e97b0181b1",
            caption: "Slide 2",
        },
        {
            imgSrc: "https://asset.cloudinary.com/viplav2411/843cee27f5b9ade3c6c589e97b0181b1",
            caption: "Slide 3",
        },
    ];

    return (
        <div className="max-w-lg mx-auto mt-10">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <img 
                            src={slide.imgSrc} 
                            alt={slide.caption} 
                            className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                        <p className="text-center mt-2 text-gray-700">{slide.caption}</p>
                    </div>
                ))}
            </Slider>

            <div
    style={{
        backgroundImage: `url("https://asset.cloudinary.com/viplav2411/843cee27f5b9ade3c6c589e97b0181b1")`,
        backgroundSize: "cover", // Ensures the image covers the entire div
        backgroundPosition: "center", // Centers the image
        height: "300px", // Example height for the div
    }}
>
    <h1 className="text-white text-center pt-12 text-2xl font-bold">abab</h1>
</div>

        </div>
    );
};

export default SimpleSlider;
