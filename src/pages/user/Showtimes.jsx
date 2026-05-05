import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Showtimes.css";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Showtimes = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);

        const movieRes = await axios.get(`https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies/${id}`);
        setMovie(movieRes.data);

        const showtimeRes = await axios.get(
          `https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/showtimes/movie/${id}`
        );

        setShowtimes(showtimeRes.data.showtimes);
      } catch (error) {
        console.error("Seans bilgileri alınamadı:", error);
        setMovie(null);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!movie) {
    return (
      <section className="showtimes-page">
        <div className="container">
          <h2>Film bulunamadı.</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="showtimes-page">
      <div className="container">
        <div className="showtimes-page__header">
          <p className="showtimes-page__subtitle">Seans Seçimi</p>
          <h1 className="showtimes-page__title">{movie.title}</h1>
          <p className="showtimes-page__text">
            Sana uygun seansı seç ve koltuk rezervasyonuna devam et.
          </p>
        </div>

        <div className="showtimes-page__grid">
          {showtimes.length > 0 ? (
            showtimes.map((showtime) => (
              <div className="showtime-card" key={showtime.id}>
                <div className="showtime-card__top">
                  <span className="showtime-card__format">{showtime.format}</span>
                  <span className="showtime-card__price">{showtime.price} ₺</span>
                </div>

                <h3 className="showtime-card__time">{showtime.time}</h3>
                <p className="showtime-card__info">{showtime.date}</p>
                <p className="showtime-card__info">{showtime.hall}</p>

                <Link
                  to={`/booking/${showtime.id}`}
                  className="showtime-card__button"
                >
                  Koltuk Seç
                </Link>
              </div>
            ))
          ) : (
            <p>Bu film için seans bulunamadı.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Showtimes;