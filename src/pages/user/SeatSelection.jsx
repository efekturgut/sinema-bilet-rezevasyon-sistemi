import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./SeatSelection.css";

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const showtimeRes = await axios.get(
          `https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/showtimes/${showtimeId}`
        );

        const currentShowtime = showtimeRes.data;
        setShowtime(currentShowtime);

        const movieRes = await axios.get(
          `https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies/${currentShowtime.movieId}`
        );
        setMovie(movieRes.data);

        const seatsRes = await axios.get(
          `https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/seats/${showtimeId}`
        );
        setSeats(seatsRes.data.seats);
      } catch (error) {
        console.error("Seans, film veya koltuk bilgisi alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showtimeId]);

  const toggleSeat = (seat) => {
    if (seat.isReserved) return;

    const exists = selectedSeats.includes(seat.id);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((item) => item !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const totalPrice = selectedSeats.length * (showtime?.price || 0);

  const handleReservation = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!showtime || !movie || selectedSeats.length === 0) return;

    try {
      setSubmitting(true);

      const payload = {
        userId: user.id,
        movieTitle: movie.title,
        date: showtime.date,
        time: showtime.time,
        hall: showtime.hall,
        seats: selectedSeats,
        totalPrice,
        showtimeId: Number(showtimeId),
      };

      const response = await axios.post(
        "https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/reservations",
        payload
      );

      toast.success(response.data.message);
      navigate("/my-reservations");
    } catch (error) {
      console.error("Rezervasyon oluşturulamadı:", error);
      toast.error("Rezervasyon sırasında bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="seat-selection">
        <div className="container">
          <h2>Rezervasyon bilgileri yükleniyor...</h2>
        </div>
      </section>
    );
  }

  if (!showtime || !movie) {
    return (
      <section className="seat-selection">
        <div className="container">
          <h2>Seans bulunamadı.</h2>
          <p className="seat-selection__text">
            Seçtiğiniz seans veya film bilgisi sistemde bulunamadı.
          </p>
          <Link to="/movies" className="booking-summary__back">
            Filmlere Dön
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="seat-selection">
      <div className="container">
        <div className="seat-selection__header">
          <p className="seat-selection__subtitle">Koltuk Seçimi</p>
          <h1 className="seat-selection__title">{movie.title}</h1>
          <p className="seat-selection__text">
            {showtime.date} • {showtime.time} • {showtime.hall} • {showtime.format}
          </p>
        </div>

        <div className="seat-selection__screen">PERDE</div>

        <div className="seat-selection__content">
          <div className="seat-selection__layout">
            {Object.entries(groupedSeats).map(([row, rowSeats]) => (
              <div className="seat-selection__row" key={row}>
                <div className="seat-selection__row-label">{row}</div>

                <div className="seat-selection__row-seats">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);

                    return (
                      <button
                        key={seat.id}
                        className={`seat ${
                          seat.isReserved ? "seat--reserved" : ""
                        } ${isSelected ? "seat--selected" : ""}`}
                        onClick={() => toggleSeat(seat)}
                      >
                        {seat.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="booking-summary">
            <h3 className="booking-summary__title">Rezervasyon Özeti</h3>

            <div className="booking-summary__row">
              <span>Film</span>
              <span>{movie.title}</span>
            </div>

            <div className="booking-summary__row">
              <span>Seans</span>
              <span>{showtime.time}</span>
            </div>

            <div className="booking-summary__row">
              <span>Tarih</span>
              <span>{showtime.date}</span>
            </div>

            <div className="booking-summary__row">
              <span>Salon</span>
              <span>{showtime.hall}</span>
            </div>

            <div className="booking-summary__row">
              <span>Format</span>
              <span>{showtime.format}</span>
            </div>

            <div className="booking-summary__row">
              <span>Seçili Koltuklar</span>
              <span>
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
              </span>
            </div>

            <div className="booking-summary__row booking-summary__row--total">
              <span>Toplam</span>
              <span>{totalPrice} ₺</span>
            </div>

            <button
              className="booking-summary__button"
              disabled={selectedSeats.length === 0 || submitting}
              onClick={handleReservation}
            >
              {submitting ? "Kaydediliyor..." : "Rezervasyonu Tamamla"}
            </button>

            <Link
              to={`/movies/${movie.id}/showtimes`}
              className="booking-summary__back"
            >
              Seanslara Geri Dön
            </Link>
          </div>
        </div>

        <div className="seat-selection__legend">
          <div className="seat-selection__legend-item">
            <span className="seat-selection__legend-box"></span>
            <span>Boş</span>
          </div>

          <div className="seat-selection__legend-item">
            <span className="seat-selection__legend-box seat-selection__legend-box--selected"></span>
            <span>Seçili</span>
          </div>

          <div className="seat-selection__legend-item">
            <span className="seat-selection__legend-box seat-selection__legend-box--reserved"></span>
            <span>Dolu</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeatSelection;