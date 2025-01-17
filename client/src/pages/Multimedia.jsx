import React, { useState, useEffect } from "react";
import axios from "axios";

const Multimedia = () => {
    const [images, setImages] = useState([
        {
          id: 1,
          name: "Przykładowe zdjęcie 1",
          alt_text: "Opis zdjęcia 1",
          file_path: "uploads/example1.jpg",
        },
        {
          id: 2,
          name: "Przykładowe zdjęcie 2",
          alt_text: "Opis zdjęcia 2",
          file_path: "uploads/example2.jpg",
        },
        {
          id: 3,
          name: "Przykładowe zdjęcie 3",
          alt_text: "Opis zdjęcia 3",
          file_path: "uploads/example3.jpg",
        },
      ]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [altText, setAltText] = useState("");

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/multimedia/images");
//         setImages(response.data);
//       } catch (error) {
//         console.error("Błąd pobierania zdjęć: ", error);
//       }
//     };

//     fetchImages();
//   }, []);

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
        setImages([...images, response.data]);
        setFile(null);
        setName("");
        setAltText("");
    } catch (error) {
        console.error("Błąd dodawania zdjęcia: ", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-md text-secondary">
      <h1 className="text-2xl font-bold mb-4">Dodaj zdjęcia do bazy danych</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold">Wybierz zdjęcie:</label>
          <input
            type="file"
            name="file"
            className="w-full px-3 py-2 border-gray-700 bg-input rounded"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold">Nazwa:</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border-gray-700 bg-input rounded"
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
            className="w-full px-3 py-2 border-gray-700 bg-input rounded"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-accent hover-bg-accent text-white py-2 rounded font-bold">Dodaj zdjęcie</button>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4">Dodane zdjęcia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white p-4 rounded shadow-md">
            <img src={`http://localhost:8080/${image.file_path}`} alt={image.alt_text} className="w-full h-auto mb-4" />
            <input
              type="text"
              className="w-full px-3 py-2 border-gray-700 bg-input rounded mb-2"
              value={image.name}
              onChange={(e) => setImages(images.map((img) => (img.id === image.id ? { ...img, name: e.target.value } : img)))}
            />
            <input
              type="text"
              className="w-full px-3 py-2 border-gray-700 bg-input rounded mb-2"
              value={image.alt_text}
              onChange={(e) => setImages(images.map((img) => (img.id === image.id ? { ...img, alt_text: e.target.value } : img)))}
            />
            <button
              className="w-full bg-accent hover-bg-accent text-white py-2 rounded font-bold mb-2"
            >
              Zaktualizuj
            </button>
            <button
              className="w-full bg-red-500 hover-bg-red-700 text-white py-2 rounded font-bold"
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