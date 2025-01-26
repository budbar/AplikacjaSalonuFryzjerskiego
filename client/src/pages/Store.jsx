import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import EmptyPageStatement from "../components/EmptyPageStatement";

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
    products.length > 0 ? (
      <div className="container mx-auto max-w-screen-xl mt-10 bg-primary rounded-lg px-4 py-4">
        <h1 className="text-3xl font-bold mb-6 text-secondary">Sklep</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-color p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src={product.url} alt={product.alt_text} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h2 className="text-xl text-secondary font-semibold mb-2">{product.name}</h2>
              <p className="mb-2 text-secondary">{product.description}</p>
              <p className="font-bold mb-4 text-secondary">{product.price} PLN</p>
              <button
                className="w-full bg-button hover:bg-button-dark text-secondary py-2 rounded font-bold transition-colors duration-300"
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
    ) : (
      <EmptyPageStatement statement={"Brak produktów w sklepie."}/>
    )
  );
}

export default Store;
