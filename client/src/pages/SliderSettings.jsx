import React, { useState, useEffect } from "react";
import axios from "axios";
import { SliderSelectionEnum } from "../../../server/enums/SliderSelectionEnum.js"

const SliderSettings = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:8080/multimedia/get-images");
        const imagesData = response.data.map((image) => {
          const blob = new Blob([new Uint8Array(image.image_data.data)], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          return { ...image, url };
        });

        setImages(imagesData);
        setAvailableImages(imagesData.filter(image => image.slider_selection == SliderSelectionEnum.NotSelectedForSlider));
        setSelectedImages(imagesData.filter(image => image.slider_selection == SliderSelectionEnum.SelectedForSlider));
      } catch (error) {
        console.error("Błąd pobierania zdjęć: ", error);
      }
    };

    fetchImages();
  }, []);

  const handleSliderEdit = async (id, action) => {
    try {
      const updatedImages = images.map((image) => {
        if (image.id === id) {
          return { ...image, slider_selection: action};
        }
        return image;
      });

      setImages(updatedImages);
      setAvailableImages(updatedImages.filter(image => image.slider_selection == SliderSelectionEnum.NotSelectedForSlider));
      setSelectedImages(updatedImages.filter(image => image.slider_selection == SliderSelectionEnum.SelectedForSlider));

      await axios.put(`http://localhost:8080/slider-settings/edit-slider/${id}`, {
        sliderSetting: action,
      });
    } catch (error) {
      console.error("Błąd aktualizacji zdjęcia: ", error);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-md text-secondary">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">Wybrane zdjęcia do slidera</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedImages.map((image) => (
            <div key={image.id} className="bg-color p-4 rounded-lg shadow-md">
              <img src={image.url} alt={image.alt_text} className="w-full h-auto mb-4 rounded-lg" />
              <button
                className="w-full bg-red-500 border border-2 border-red-300 text-secondary py-2 rounded font-bold mb-2"
                onClick={() => handleSliderEdit(image.id, SliderSelectionEnum.NotSelectedForSlider)}
              >
                Usuń ze slidera
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-4 p-6 bg-primary rounded-lg shadow-md text-secondary">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">Zdjęcia do wyboru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableImages.map((image) => (
            <div key={image.id} className="bg-color p-4 rounded shadow-md">
              <img src={image.url} alt={image.alt_text} className="w-full h-auto mb-4 rounded-lg" />
              <button
                className="w-full bg-button hover-bg-button text-secondary py-2 rounded font-bold mb-2"
                onClick={() => handleSliderEdit(image.id, SliderSelectionEnum.SelectedForSlider)}
              >
                Dodaj do slidera
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SliderSettings;