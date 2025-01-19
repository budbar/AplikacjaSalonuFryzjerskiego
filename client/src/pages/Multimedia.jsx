import React, { useState, useEffect } from "react";
import axios from "axios";

const Multimedia = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [altText, setAltText] = useState("");

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
      } catch (error) {
        console.error("Błąd pobierania zdjęć: ", error);
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("altText", altText);

    try {
      const response = await axios.post("http://localhost:8080/multimedia/add-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const blob = new Blob([new Uint8Array(response.data.image_data.data)], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImages([...images, { ...response.data, url }]);
      setFile(null);
      setName("");
      setAltText("");
    } catch (error) {
      console.error("Błąd dodawania zdjęcia: ", error);
    }
  };

  const handleUpdate = async (id, updatedName, updatedAltText) => {
    try {
      const response = await axios.put(`http://localhost:8080/multimedia/update-image/${id}`, {
        name: updatedName,
        altText: updatedAltText,
      });
      setImages(images.map((image) => (image.id === id ? { ...response.data, url: image.url } : image)));
      window.location.reload(); //Tymczasowe rozwiązanie trzeba będzie naprawić ten bug w konsoli przy edycji zdjęcia
    } catch (error) {
      console.error("Błąd aktualizacji zdjęcia: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/multimedia/delete-image/${id}`);
      setImages(images.filter((image) => image.id !== id));
    } catch (error) {
      console.error("Błąd usuwania zdjęcia: ", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-md text-secondary">
      <h1 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Dodaj zdjęcia do bazy danych</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold">Wybierz zdjęcie:</label>
          <input
            type="file"
            name="file"
            className="w-full px-3 py-2 border border-gray-200 bg-input rounded-lg"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold">Nazwa:</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold">Tekst alternatywny:</label>
          <input
            type="text"
            name="altText"
            className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-button hover-bg-button text-secondary py-2 rounded font-bold">Dodaj zdjęcie</button>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4">Dodane zdjęcia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-color p-4 rounded shadow-md">
            <img src={image.url} alt={image.alt_text} className="w-full h-auto mb-4" />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg mb-2"
              value={image.name}
              onChange={(e) => setImages(images.map((img) => (img.id === image.id ? { ...img, name: e.target.value } : img)))}
            />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg mb-2"
              value={image.alt_text}
              onChange={(e) => setImages(images.map((img) => (img.id === image.id ? { ...img, alt_text: e.target.value } : img)))}
            />
            <button
              className="w-full bg-button hover-bg-button text-secondary py-2 rounded font-bold mb-2"
              onClick={() => handleUpdate(image.id, image.name, image.alt_text)}
            >
              Zaktualizuj
            </button>
            <button
              className="w-full bg-button-cancel hover-bg-red-700 text-secondary py-2 rounded font-bold"
              onClick={() => handleDelete(image.id)}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Multimedia;