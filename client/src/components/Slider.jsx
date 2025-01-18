import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images, numberOfSlides }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: numberOfSlides,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="w-4/5">
        <Slider {...settings}>
          {images.map((image) => (
            <div key={image.id}>
              <img src={image.url} alt={image.alt_text} className="w-full h-auto" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageSlider;