import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMovies.css";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/admin/reservations"
        );

        setReservations(response.data.reservations || []);
      } catch (error) {
        console.error("Rezervasyonlar alınamadı:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <section className="admin-movies">
      <div className="container">
        <h1>Rezervasyon Yönetimi</h1>

        <div className="admin-movies__list">
          {reservations.map((reservation) => (
            <div className="admin-movies__card" key={reservation.id}>
              <div>
                <h3>{reservation.movieTitle}</h3>
                <p>
                  Kullanıcı: {reservation.userName} - {reservation.userEmail}
                </p>
                <p>
                  {reservation.date} / {reservation.time} / {reservation.hall}
                </p>
                <p>Koltuklar: {reservation.seats.join(", ")}</p>
                <p>Toplam: {reservation.totalPrice} ₺</p>
                <p>Durum: {reservation.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminReservations;