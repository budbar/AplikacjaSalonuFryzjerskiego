import React, { useEffect, useState } from "react";
import axios from "axios";
import { OrderStatusEnum } from "../../../server/enums/OrderStatusEnum.js";
import EmptyPageStatement from "../components/EmptyPageStatement";

const Orders = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8080/session', { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                console.error('Błąd pobierania danych użytkownika:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return; 

            try {
                const response = user.level === 1
                    ? await axios.get("http://localhost:8080/orders/get-all-orders")
                    : await axios.get(`http://localhost:8080/orders/get-orders/${user.id}`);
                
                setOrders(response.data);
            } catch (error) {
                console.error("Błąd pobierania zamówień: ", error);
            }
        };

        fetchOrders();
    }, [user]);

    const ChooseOrderStatus = (orderStatus) => {
        switch(orderStatus) {
            case OrderStatusEnum.Realized:
                return "Zrealizowane";
            case OrderStatusEnum.InProgress:
                return "W trakcie realizacji";
            case OrderStatusEnum.Canceled:
                return "Anulowane";
            default:
                return "Nieznany status";
        }
    }

    const handleSubmit = async (orderId, orderStatus) => {
        try {
            const response = await axios.put(`http://localhost:8080/orders/edit-order-status/${orderId}`, { orderStatus: orderStatus});
            setOrders(orders.map((order) => (order.id === orderId ? { ...response.data, status: orderStatus } : order.status)));
            window.location.reload();
        } catch (error) {
            console.log("Błąd zmiany stanu zamówienia: ", error);
        }
    }
    
    if(orders.length == 0) {
        return (
            <EmptyPageStatement statement={"Brak złożonych zamówień."}/>
        );
    }

    return (
        <div className="container bg-primary text-secondary rounded-lg mx-auto max-w-screen-xl mt-10 p-4 p-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary">Zamówienia</h1>
            <table className="min-w-full rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">#</th>
                        <th className="py-2 px-4 border-b">ID zamówienia</th>
                        <th className="py-2 px-4 border-b">Data zamówienia</th>
                        <th className="py-2 px-4 border-b">Status zamówienia</th>
                        <th className="py-2 px-4 border-b">Operacje</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    orders.map((order, index) => (
                        <tr key={order.id}>
                            <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                            <td className="py-2 px-4 border-b text-center">{order.id}</td>
                            <td className="py-2 px-4 border-b text-center">{order.create_date.slice(0, 10)}</td>
                            <td className="py-2 px-4 border-b text-center">{ChooseOrderStatus(order.status)}</td>
                            <td className="py-2 px-4 border-b text-center">
                                {
                                    user && user.level == 1 ? (
                                        <>
                                            <button 
                                                type="submit" 
                                                className={`font-bold flex items-center justify-center rounded-lg px-5 py-2.5 text-sm mx-auto cursor-pointer mb-1
                                                            ${order.status === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-button'} w-32 h-10`}
                                                onClick={() =>  handleSubmit(order.id, OrderStatusEnum.Realized)}
                                                disabled={order.status === 1}
                                            >
                                                Zrealizowane
                                            </button>
                                            <button 
                                                type="submit" 
                                                className={`font-bold flex items-center justify-center rounded-lg px-5 py-2.5 text-sm mx-auto cursor-pointer  mb-1
                                                            ${order.status === 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-button-warning'} w-32 h-10`}
                                                onClick={() =>  handleSubmit(order.id, OrderStatusEnum.InProgress)}
                                                disabled={order.status === 2}
                                            >
                                                W trakcie
                                            </button>
                                            <button 
                                                type="submit" 
                                                className={`font-bold flex items-center justify-center rounded-lg px-5 py-2.5 text-sm mx-auto cursor-pointer 
                                                            ${order.status === 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-button-cancel'} w-32 h-10`}
                                                onClick={() =>  handleSubmit(order.id, OrderStatusEnum.Canceled)}
                                                disabled={order.status === 3}
                                            >
                                                Anulowane
                                            </button>
                                        </>  
                                    ) : (
                                        <button 
                                            type="submit" 
                                            className={`font-bold flex items-center justify-center rounded-lg px-5 py-2.5 text-sm mx-auto cursor-pointer 
                                                        ${order.status === 3 || order.status === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-button-cancel'}`}
                                            onClick={() =>  handleSubmit(order.id, OrderStatusEnum.Canceled)}
                                            disabled={order.status===3}
                                        >
                                            Anuluj zamówienie
                                        </button>
                                    )
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;