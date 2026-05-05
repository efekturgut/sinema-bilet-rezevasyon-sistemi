import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies/${id}`
        );

        setMovie(response.data);
      } catch (error) {
        console.error("Film detayı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <section className="movie-detail">
        <div className="container">
          <h2>Film yükleniyor...</h2>
        </div>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="movie-detail movie-detail--not-found">
        <div className="container">
          <h2 className="movie-detail__not-found-title">Film bulunamadı.</h2>
          <p className="movie-detail__not-found-text">
            Aradığınız film sistemde bulunmuyor olabilir.
          </p>

          <Link to="/movies" className="movie-detail__back-button">
            Filmlere Dön
          </Link>
        </div>
      </section>
    );
  }

  const trailerEmbedUrl = movie.trailerUrl
    ? movie.trailerUrl.replace("watch?v=", "embed/").split("&")[0]
    : null;

  return (
    <section className="movie-detail">
      <div className="container movie-detail__container">
        <div className="movie-detail__image-wrapper">
          <img
            src={movie.image}
            alt={movie.title}
            className="movie-detail__image"
          />
        </div>

        <div className="movie-detail__content">
          <p className="movie-detail__badge">
            {movie.status === "coming_soon" ? "Yakında" : "Öne Çıkan Film"}
          </p>

          <h1 className="movie-detail__title">{movie.title}</h1>

          <div className="movie-detail__meta">
            <span>{movie.genre}</span>
            <span>{movie.duration}</span>
            <span>⭐ {movie.rating}</span>
            <span>{movie.releaseDate}</span>
          </div>

          <p className="movie-detail__description">{movie.description}</p>

          <div className="movie-detail__info-boxes">
            <div className="movie-detail__info-box">
              <h4>Tür</h4>
              <p>{movie.genre}</p>
            </div>

            <div className="movie-detail__info-box">
              <h4>Süre</h4>
              <p>{movie.duration}</p>
            </div>

            <div className="movie-detail__info-box">
              <h4>Durum</h4>
              <p>{movie.status === "coming_soon" ? "Yakında" : "Vizyonda"}</p>
            </div>
          </div>

          <div className="movie-detail__actions">
            {movie.status !== "coming_soon" && (
              <Link
                to={`/movies/${movie.id}/showtimes`}
                className="movie-detail__primary-btn"
              >
                Seans Seç
              </Link>
            )}

            <Link to="/movies" className="movie-detail__secondary-btn">
              Filmlere Dön
            </Link>
          </div>
        </div>
      </div>

      {trailerEmbedUrl && (
        <div className="container movie-detail__trailer">
          <h3 className="movie-detail__trailer-title">Fragman</h3>

          <div className="movie-detail__trailer-box">
            <iframe
              src={trailerEmbedUrl}
              title={`${movie.title} Fragman`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default MovieDetail;