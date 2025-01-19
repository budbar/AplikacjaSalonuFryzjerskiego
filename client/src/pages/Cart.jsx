import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = useContext(CartContext);

  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.totalPrice, 0);
  };

  return (
    cart.length > 0 ? (
      <section className="py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl bg-primary rounded-lg px-4 py-4">
        <h2 className="text-xl font-semibold text-secondary sm:text-2xl border-b border-gray-200 pb-2">Koszyk</h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
            {
              cart.map((product) => (
                  <div key={product.id} className="rounded-lg border border-gray-200 bg-color text-secondary p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <a href="#" className="shrink-0 md:order-1">
                        <img className="h-20 w-20 dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="imac image" />
                      </a>
                      <label className="sr-only">Choose quantity:</label>
                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <button 
                            type="button" 
                            id="decrement-button" 
                            data-input-counter-decrement="counter-input" 
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                            onClick={() => decrementQuantity(product.id)}  
                          >
                            <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                            </svg>
                          </button>
                          <input 
                            type="text" 
                            id="counter-input" 
                            data-input-counter 
                            className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-secondary focus:outline-none focus:ring-0 dark:text-white" 
                            placeholder="" 
                            value={product.quantity} 
                            readOnly />
                          <button 
                            type="button" 
                            id="increment-button" 
                            data-input-counter-increment="counter-input" 
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                            onClick={() => incrementQuantity(product.id)}
                          >
                            <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-secondary">{product.totalPrice} PLN</p>
                        </div>
                      </div>
                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <a href="#" className="text-base font-medium text-secondary hover:underline">{product.name}</a>
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => removeFromCart(product.id)} className="inline-flex items-center text-sm font-medium error-color hover:underline dark:text-red-500">
                            <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                            </svg>
                            Usuń z koszyka
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            <button
                  className="w-full bg-button-cancel hover:bg-red-700 text-white py-2 rounded font-bold transition-colors duration-300 mt-4"
                  onClick={clearCart}
                >
                  Wyczyść koszyk
                </button>
          </div>
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-color p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-secondary">Podsumowanie zamówienia</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-secondary dark:text-gray-400">Cena podstawowa: </dt>
                    <dd className="text-base font-medium text-secondary dark:text-white">{getTotalPrice()} PLN</dd>
                  </dl>
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-secondary">Łącznie: </dt>
                  <dd className="text-base font-bold text-secondary">{getTotalPrice()} PLN</dd>
                </dl>
              </div>
              <Link 
                to="/checkout" 
                className="bg-button text-secondary flex w-full items-center justify-center rounded-lg  px-5 py-2.5 text-sm font-bold hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Przejdź dalej
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    ): (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-primary flex w-60 h-20 rounded-lg text-secondary items-center justify-center font-bold">Koszyk jest pusty</div>
      </div>
    )
  );
}

export default Cart;