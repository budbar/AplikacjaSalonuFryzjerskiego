import React from "react";

const products = [
    { id: 1, name: "Produkt 1", price: "100 PLN", image: "link_do_zdjęcia_1" },
    { id: 2, name: "Produkt 2", price: "200 PLN", image: "link_do_zdjęcia_2" },
    { id: 3, name: "Produkt 3", price: "300 PLN", image: "link_do_zdjęcia_3" },
    { id: 4, name: "Produkt 4", price: "400 PLN", image: "link_do_zdjęcia_4" },
    { id: 5, name: "Produkt 5", price: "500 PLN", image: "link_do_zdjęcia_5" },
    { id: 6, name: "Produkt 6", price: "600 PLN", image: "link_do_zdjęcia_6" },
];


function Store() {
    return (
        <div className="container mx-auto mt-10 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-secondary">Sprawdź naszą szeroką gamę produktów!</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-primary p-4 rounded-lg shadow-lg">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2 text-secondary">{product.name}</h2>
                  <p className="text-gray-700 mb-4 text-secondary">{product.price}</p>
                  <button className="w-full bg-accent hover-bg-accent text-white py-2 rounded">Dodaj do koszyka</button>
                </div>
              </div>
            ))}
          </div>
        </div>
    );
}

export default Store;
