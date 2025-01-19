import React, { useEffect, useState } from "react";
import axios from "axios";
import { OrderStatusEnum } from "../../../server/enums/OrderStatusEnum.js";

const Orders = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
              const response = await axios.get('http://localhost:8080/session', { withCredentials: true });
              setUser(response.data.user);
              fetchOrders(response.data.user.id);
            } catch (error) {
              console.error('Błąd pobierania danych użytkownika:', error);
            }
        };

        const fetchOrders = async (userId) => {
          try {
            const response = await axios.get(`http://localhost:8080/orders/get-orders/${userId}`);
            setOrders(response.data);
          } catch (error) {
            console.error("Błąd pobierania zamówień: ", error);
          }
        };
    
        fetchUser();
    }, []);

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
            if(user && user.level == 1) {
                const response = await axios.put(`http://localhost:8080/orders/edit-order-status/${orderId}`, { orderStatus: orderStatus});
            } 
            else {
                const response = await axios.put(`http://localhost:8080/orders/edit-order-status/${orderId}`, { orderStatus: orderStatus});
                setOrders(orders.map((order) => (order.id === orderId ? { ...response.data, status: orderStatus } : order.status)));
            }

            window.location.reload();
        } catch (error) {
            console.log("Błąd zmiany stanu zamówienia: ", error);
        }
    }

    if(!user) {
        return (
            <div>
                Ładowanie...            
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-10 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-secondary">Zamówienia</h1>
            {
                orders.length > 0 ? (
                    <table className="min-w-full bg-primary text-secondary rounded-lg">
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
                                        <button 
                                            type="submit" 
                                            className={`font-bold flex items-center justify-center rounded-lg px-5 py-2.5 text-sm mx-auto cursor-pointer ${
                                                order.status === 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-button-cancel'
                                            }`}
                                            onClick={() =>  handleSubmit(order.id, OrderStatusEnum.Canceled)}
                                            disabled={order.status===3}
                                        >
                                            Anuluj zamówienie
                                        </button>
                                    
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="bg-primary text-secondary font-bold text-center ">Brak zamówień</div>
                )
            }
        </div>
    );
};

export default Orders;