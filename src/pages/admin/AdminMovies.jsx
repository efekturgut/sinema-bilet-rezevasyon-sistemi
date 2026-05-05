import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMovies.css";

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    tmdbId: "",
    title: "",
    genre: "",
    duration: "",
    rating: "",
    image: "",
    description: "",
    releaseDate: "",
  });

  const fetchMovies = async () => {
    const response = await axios.get("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies");
    setMovies(response.data.movies || response.data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();

    await axios.post("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies", {
      ...formData,
      tmdbId: formData.tmdbId ? Number(formData.tmdbId) : null,
    });

    setFormData({
      tmdbId: "",
      title: "",
      genre: "",
      duration: "",
      rating: "",
      image: "",
      description: "",
      releaseDate: "",
    });

    fetchMovies();
  };

  const handleDeleteMovie = async (id) => {
    await axios.delete(`https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies/${id}`);
    fetchMovies();
  };

  return (
    <section className="admin-movies">
      <div className="container">
        <h1>Film Yönetimi</h1>

        <form className="admin-movies__form" onSubmit={handleAddMovie}>
          <input name="tmdbId" placeholder="TMDB ID" value={formData.tmdbId} onChange={handleChange} />
          <input name="title" placeholder="Film adı" value={formData.title} onChange={handleChange} required />
          <input name="genre" placeholder="Tür" value={formData.genre} onChange={handleChange} />
          <input name="duration" placeholder="Süre" value={formData.duration} onChange={handleChange} />
          <input name="rating" placeholder="Puan" value={formData.rating} onChange={handleChange} />
          <input name="image" placeholder="Poster URL" value={formData.image} onChange={handleChange} />
          <input name="releaseDate" placeholder="Vizyon tarihi" value={formData.releaseDate} onChange={handleChange} />
          <textarea name="description" placeholder="Açıklama" value={formData.description} onChange={handleChange} />

          <button type="submit">Film Ekle</button>
        </form>

        <div className="admin-movies__list">
          {movies.map((movie) => (
            <div className="admin-movies__card" key={movie.id}>
              <img src={movie.image} alt={movie.title} />
              <div>
                <h3>{movie.title}</h3>
                <p>{movie.genre}</p>
                <p>{movie.duration}</p>
              </div>
              <button onClick={() => handleDeleteMovie(movie.id)}>Sil</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminMovies;