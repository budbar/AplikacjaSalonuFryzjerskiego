import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { PaymentMethodsEnum } from "../../../server/enums/PaymentMethodsEnum";
import { PostageMethodsEnum } from "../../../server/enums/PostageMethodsEnum";
import axios from "axios";

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [residence, setResidence] = useState("");
    const [town, setTown] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");
    const [paymentMethod, setMethodOfPayment] = useState();
    const [paymentMethodText, setPaymentMethodText] = useState("Nie wybrano");
    const [postage, setPostage] = useState(0);
    const [postageCost, setPostageMethodCost] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get('http://localhost:8080/session', { withCredentials: true });
            setUser(response.data.user);
            fetchAddressData(response.data.user.email);
          } catch (error) {
            console.error('Błąd pobierania danych użytkownika:', error);
          }
        };
    
        const fetchAddressData = async (email) => {
          try {
            const response = await axios.get(`http://localhost:8080/account/get-address-data?email=${email}`);
            const { residence, town, zip_code, country, phone_number} = response.data;
            setResidence(residence || "");
            setTown(town || "");
            setZipCode(zip_code || "");
            setCountry(country || "");
            setPhoneNumber(phone_number || "");
    
          } catch(error) {
            console.error("Błąd pobierania danych adresowych: ", error);
          }
        };
    
        fetchUser();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!paymentMethod) {
            setError("Wybierz metodę płatności.");
            return;
        }

        if(!postage) {
            setError("Wybierz sposób dostawy.");
            return;
        }

        setError("");

        try {
            const addressDetails = {
                phone_number: phoneNumber,
                residence,
                town,
                zip_code: zipCode,
                country
            };

            const orderedData = {
                address_details: addressDetails,
                payment_method: paymentMethod,
                postage,
                final_price: finalPrice(),
                user_id: user.id
            };
            const response = await axios.post("http://localhost:8080/checkout/add-order", orderedData);
            await clearCart();
            window.location.replace("/home");
        } catch (error) {
            console.error("Błąd finalizowania zamówienia: ", error);
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + product.totalPrice, 0);
    };

    const finalPrice = () => {
        return getTotalPrice() + postageCost;
    };

    if(!user)
        return (
          <div>
            Ładowanie...
          </div>
    );

    return (
        <section className="bg- py-8 antialiased dark:bg-gray-900 md:py-16">
            <form onSubmit={handleSubmit} className="mx-auto max-w-screen-xl bg-primary rounded-lg px-4 py-4 ">
                <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                    <div className="min-w-0 flex-1 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-secondary dark:text-white sm:text-2xl">Podsumowanie zamówienia</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Imię: </label>
                                    <input 
                                        type="text" 
                                        id="first_name" 
                                        className="block w-full rounded-lg border border-gray-300 bg-input p-2.5 text-sm text-secondary focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                        value={user.first_name}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Nazwisko: </label>
                                    <input 
                                        type="text" 
                                        id="last_name" 
                                        className="block w-full rounded-lg border border-gray-300 bg-input p-2.5 text-sm text-secondary focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                        value={user.last_name}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Adres email: </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="block w-full rounded-lg border border-gray-300 bg-input p-2.5 text-sm text-secondary focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                        value={user.email}
                                        readOnly 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone_number" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Numer telefonu: </label>
                                    <input 
                                        type="text" 
                                        id="phone_number" 
                                        className="block w-full rounded-lg border border-s-0 border-gray-300 bg-input p-2.5 text-sm text-secondary" 
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="residence" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Adres zamieszkania: </label>
                                    <input 
                                        type="text" 
                                        id="residence" 
                                        className="block w-full rounded-lg border border-gray-300 bg-input p-2.5 text-sm text-secondary"
                                        value={residence}
                                        onChange={(e) => setResidence(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="town" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Miejscowość: </label>
                                    <input 
                                        type="text" 
                                        id="town" 
                                        className="block w-full rounded-lg border border-gray-300 bg-input p-2.5 text-sm text-secondary" 
                                        value={town}
                                        onChange={(e) => setTown(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="zip_code" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Kod pocztowy: </label>
                                    <input 
                                        type="text" 
                                        id="zip_code" 
                                        className="block w-full rounded-lg border border-gray-300 bg-input p-2.5 text-sm text-secondary" 
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="country" className="mb-2 block text-sm font-medium text-secondary dark:text-white"> Kraj: </label>
                                    <input 
                                    type="text" 
                                    id="country" 
                                    className="block w-full rounded-lg border border-gray-300 bg-input p-2.5 text-sm text-secondary" 
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-secondary dark:text-white">Płatność</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg border border-gray-200 bg-input p-4 ps-4">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input 
                                                id="credit_card" 
                                                aria-describedby="credit-card-text" 
                                                type="radio" 
                                                name="payment-method" 
                                                value={paymentMethod}
                                                onChange={() => { setMethodOfPayment(PaymentMethodsEnum.CreditCard); setError(""); setPaymentMethodText("Karta kredytowa")}} 
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="credit_card" className="font-medium leading-none text-secondary dark:text-white"> Karta kredytowa </label>
                                            <p id="credit-card-text" className="mt-1 text-xs font-normal text-secondary">Zapłać swoją kartą kredytową</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-input p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input 
                                                id="pay_on_delivery" 
                                                aria-describedby="pay-on-delivery-text" 
                                                type="radio" 
                                                name="payment-method" 
                                                value={paymentMethod}
                                                onChange={() => { setMethodOfPayment(PaymentMethodsEnum.OnDelivery); setError(""); setPaymentMethodText("Przy odbiorze")}} 
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" 
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="pay_on_delivery" className="font-medium leading-none text-secondary dark:text-white"> Przy odbiorze </label>
                                            <p id="pay_on_delivery-text" className="mt-1 text-xs font-normal text-secondary">Zapłać za przesykłkę przy odbiorze zamówienia</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-input p-4 ps-4">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input 
                                                id="blik" 
                                                aria-describedby="paypal-text" 
                                                type="radio" 
                                                name="payment-method" 
                                                value={paymentMethod}
                                                onChange={() => { setMethodOfPayment(PaymentMethodsEnum.Blik); setError(""); setPaymentMethodText("BLIK")}} 
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" 
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="blik" className="font-medium leading-none text-secondary dark:text-white"> BLIK </label>
                                            <p id="blik-text" className="mt-1 text-xs font-normal text-secondary">Zapłać z pomocą usługi BLIK</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-secondary dark:text-white">Sposób dostawy</h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg border border-gray-200 bg-input p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input 
                                                id="dhl" 
                                                aria-describedby="dhl-text" 
                                                type="radio" 
                                                name="delivery-method" 
                                                value={postage}
                                                onChange={() => { setPostage(PostageMethodsEnum.Dhl); setError(""); setPostageMethodCost(12.99)}} 
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="dhl" className="font-medium leading-none text-secondary"> 12.99 PLN - DHL </label>
                                            <p id="dhl-text" className="mt-1 text-xs font-normal text-secondary">Przesyłka dotrze w przeciągu 2-3 dni roboczych</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-input p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input 
                                            id="express" 
                                            aria-describedby="express-text" 
                                            type="radio" 
                                            name="delivery-method" 
                                            value={postage}
                                            onChange={() => { setPostage(PostageMethodsEnum.InPostExpress); setError(""); setPostageMethodCost(16.99)}} 
                                            className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" 
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="express" className="font-medium leading-none text-secondary dark:text-white"> 16.99 PLN - InPost Express </label>
                                            <p id="express-text" className="mt-1 text-xs font-normal text-secondary">Przesyłka dotrze jeszcze dzisiaj</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md bg-input text-secondary rounded-lg p-4 border border-gray-200">
                        <p className="text-xl font-semibold">Podsumowanie płatności</p>
                        <div className="flow-root">
                            <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal dark:text-gray-400">Cena podstawowa: </dt>
                                    <dd className="text-base font-medium dark:text-white">{getTotalPrice()} PLN</dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal dark:text-gray-400">Koszt przesyłki:</dt>
                                    <dd className="text-base font-medium dark:text-white">{postageCost} PLN</dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal dark:text-gray-400">Metoda płatności:</dt>
                                    <dd className="text-base font-medium dark:text-white">{paymentMethodText}</dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-bold dark:text-white">Łącznie: </dt>
                                    <dd className="text-base font-bold dark:text-white">{finalPrice()} PLN</dd>
                                </dl>
                            </div>
                        </div>
                        {error && <p className="error-color">{error}</p>}
                        <button 
                            type="submit" 
                            className="font-bold flex w-full items-center justify-center rounded-lg bg-button px-5 py-2.5 text-sm"
                        >
                            Sfinalizuj zamówienie
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default Checkout;