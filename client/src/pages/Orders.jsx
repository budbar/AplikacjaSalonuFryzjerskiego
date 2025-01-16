import React from "react";

const orders = [
    { id: 1, date: "2023-10-01", status: "Zrealizowane" },
    { id: 2, date: "2023-10-02", status: "W trakcie realizacji" },
    { id: 3, date: "2023-10-03", status: "Anulowane" },
    { id: 4, date: "2023-10-04", status: "Zrealizowane" },
    { id: 5, date: "2023-10-05", status: "W trakcie realizacji" },
    { id: 6, date: "2023-10-06", status: "Anulowane" },
];

const Orders = () => {
    return (
        <div className="container mx-auto mt-10 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-secondary">Zamówienia</h1>
            {
                orders.length > 0 ? (
                    <table className="min-w-full bg-primary text-secondary">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">#</th>
                            <th className="py-2 px-4 border-b">ID zamówienia</th>
                            <th className="py-2 px-4 border-b">Data zamówienia</th>
                            <th className="py-2 px-4 border-b">Status zamówienia</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.id}>
                            <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                            <td className="py-2 px-4 border-b text-center">{order.id}</td>
                            <td className="py-2 px-4 border-b text-center">{order.date}</td>
                            <td className="py-2 px-4 border-b text-center">{order.status}</td>
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