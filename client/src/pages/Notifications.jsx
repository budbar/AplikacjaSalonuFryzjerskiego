import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Check, X, Calendar } from 'lucide-react';
import EmptyPageStatement from '../components/EmptyPageStatement';
import axios from 'axios';

const Notifications = () => {
    const [user, setUser] = useState();
    const [notifications, setNotifications] = useState([
    // {
    //   id: 1,
    //   content: "Nowa odpowiedź na twój komentarz w poście 'Najnowsze trendy 2024'",
    //   type: "comment",
    //   date: "2024-01-28",
    //   isRead: false,
    //   link: "/post/1"
    // },
    // {
    //   id: 2,
    //   content: "Twój post został zaakceptowany przez administratora",
    //   type: "post",
    //   date: "2024-01-27",
    //   isRead: true,
    //   link: "/post/2"
    // },
    // {
    //   id: 3,
    //   content: "Przypomnienie o umówionej wizycie w salonie jutro o 15:00",
    //   type: "appointment",
    //   date: "2024-01-26",
    //   isRead: false,
    //   link: "/appointments"
    // }
  ]);

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
    const fetchNotifications = async () => {
      try {
        if (!user || user.level === undefined) return;

        let notifications = [];

        if(user.level == 1) {
            const response = await axios.get("http://localhost:8080/notification/get-notifications");
            notifications = response.data;
        }
        else if (user.level == 2) {
            const response = await axios.get(`http://localhost:8080/notification/get-notifications-by-category/${user.assigned_category}`);
            notifications = response.data;
        }
        else {
            const response = await axios.get(`http://localhost:8080/notification/get-notifications-by-id/${user.id}`);
            notifications = response.data;
        }
        
        setNotifications(notifications);
      } catch (error) {
        console.error("Błąd pobierania powiadomień: ", error);
      }
    };

    fetchNotifications();
  }, [user]);
  
  const handleDelete = async (id) => {
    try {
        await axios.put(`http://localhost:8080/notification/update-notifications-status/${id}`);
        setImages(images.filter((image) => image.id !== id));
    } catch (error) {
        console.error("Błąd usuwania posta: ", error);
    }
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  if (notifications.length === 0) {
    return (
      <EmptyPageStatement statement={"Brak powiadomień"}/>
    );
  }

  return (
    <section className="py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl bg-primary rounded-lg px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary sm:text-2xl flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Powiadomienia
          </h2>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg bg-element text-secondary p-4 shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1">
                    <p className='font-semibold'>
                      {notification.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {notification.create_date.slice(0, 10)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Usuń powiadomienie"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notifications;