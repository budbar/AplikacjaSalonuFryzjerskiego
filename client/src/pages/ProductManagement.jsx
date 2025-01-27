import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [altText, setAltText] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products-management/get-products");
        const productsData = response.data.map((product) => {
          const blob = new Blob([new Uint8Array(product.image_data.data)], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          return { ...product, url };
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Błąd pobierania produktów: ", error);
      }
    };

    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("altText", altText);

    try {
      const response = await axios.post("http://localhost:8080/products-management/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const blob = new Blob([new Uint8Array(response.data.image_data.data)], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setProducts([...products, { ...response.data, url }]);
      setFile(null);
      setName("");
      setDescription("");
      setPrice("");
      setAltText("");
    } catch (error) {
      console.error("Błąd dodawania produktu: ", error);
    }
  };

  const handleUpdate = async (id, updatedName, updatedDescription, updatedPrice, updatedAltText) => {
    try {
      const response = await axios.put(`http://localhost:8080/products-management/update-product/${id}`, {
        name: updatedName,
        description: updatedDescription,
        price: updatedPrice,
        altText: updatedAltText,
      });
      setProducts(products.map((product) => (product.id === id ? { ...response.data, url: product.url } : product)));
      window.location.reload(); //Tymczasowe rozwiązanie trzeba będzie naprawić ten bug w konsoli przy edycji zdjęcia
    } catch (error) {
      console.error("Błąd aktualizacji produktu: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/products-management/delete-product/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Błąd usuwania produktu: ", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-md text-secondary">
      <h1 className="text-2xl font-bold mb-4 underline-border pb-2">Dodaj produkty do bazy danych</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold">Wybierz zdjęcie:</label>
          <input
            type="file"
            name="file"
            className="w-full px-3 py-2 bg-input rounded-lg"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold">Nazwa:</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 bg-input rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold">Opis:</label>
          <input
            type="text"
            name="description"
            className="w-full px-3 py-2 bg-input rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold">Cena:</label>
          <input
            type="number"
            name="price"
            className="w-full px-3 py-2 bg-input rounded-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">  
            <label className="block font-bold">Tekst alternatywny do zdjęcia</label>
            <input
                type="text"
                name="altText"
                className="w-full px-3 py-2 bg-input rounded-lg"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                required
            />
        </div>
        <button type="submit" className="w-full bg-button hover-bg-button text-secondary py-2 rounded font-bold">Dodaj produkt</button>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-gray-200 pb-2">Dodane produkty</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-color p-4 rounded shadow-md rounded-lg">
            <img src={product.url} alt={product.alt_text} className="w-full h-auto mb-4" />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg mb-2"
              value={product.name}
              onChange={(e) => setProducts(products.map((prdct) => (prdct.id === product.id ? { ...prdct, name: e.target.value } : prdct)))}
            />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg mb-2"
              value={product.description}
              onChange={(e) => setProducts(products.map((prdct) => (prdct.id === product.id ? { ...prdct, description: e.target.value } : prdct)))}
            />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg mb-2"
              value={product.price}
              onChange={(e) => setProducts(products.map((prdct) => (prdct.id === product.id ? { ...prdct, price: e.target.value } : prdct)))}
            />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 bg-input rounded-lg mb-2"
              value={product.alt_text}
              onChange={(e) => setProducts(products.map((prdct) => (prdct.id === product.id ? { ...prdct, alt_text: e.target.value } : prdct)))}
            />
            <button
              className="w-full bg-button hover-bg-button text-secondary py-2 rounded font-bold mb-2"
              onClick={() => handleUpdate(product.id, product.name, product.description, product.price, product.alt_text)}
            >
              Zaktualizuj
            </button>
            <button
              className="w-full bg-red-500 border border-2 border-red-300 text-secondary py-2 rounded font-bold"
              onClick={() => handleDelete(product.id)}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;