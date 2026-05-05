import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../../components/movie/MovieCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./Movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const response = await axios.get("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies");

        setMovies(response.data.movies || []);
      } catch (error) {
        console.error("Filmler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="movies-page">
      <div className="container">
        <div className="movies-page__header">
          <p className="movies-page__subtitle">Film Arşivi</p>
          <h1 className="movies-page__title">Seçili Filmler</h1>
        </div>

        <div className="movies-page__grid">
          {movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : (
            <div className="empty-state">
              <h3>Film bulunamadı</h3>
              <p>Şu anda listelenecek film yok.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Movies;