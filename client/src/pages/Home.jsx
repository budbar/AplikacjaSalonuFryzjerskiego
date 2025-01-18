import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageSlider from "../components/Slider";

function Home() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:8080/slider-settings/get-slider-images");
        const imagesData = response.data.map((image) => {
          const blob = new Blob([new Uint8Array(image.image_data.data)], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          return { ...image, url };
        });
        setImages(imagesData);
      } catch (error) {
        console.error("Błąd pobierania zdjęć: ", error);
      }
    };

    fetchImages();
  }, []);

  if(!images)
    return (
      <div>
        Ładowanie...
      </div>
    );

  return (
    <>
        <ImageSlider images={images} numberOfSlides={images.length}/>
    </>
  );
}

export default Home;