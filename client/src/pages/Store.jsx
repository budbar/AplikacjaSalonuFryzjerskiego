import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

function Store() {
  const [ products, setProducts ] = useState([]);
  const { addToCart } = useContext(CartContext);

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

  return (
    <div className="container mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-secondary">Sprawdź szeroką gamę produktów!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img src={product.url} alt={product.alt_text} className="w-full h-48 object-cover rounded-t-lg mb-4" />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-gray-900 font-bold mb-4">{product.price} zł</p>
            <button
              className="w-full bg-accent hover:bg-accent-dark text-white py-2 rounded font-bold transition-colors duration-300"
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price
              })}
            >
              Dodaj do koszyka
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
