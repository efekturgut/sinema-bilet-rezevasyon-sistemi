import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMovies.css";

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);

  const [formData, setFormData] = useState({
    movieId: "",
    hall: "",
    date: "",
    time: "",
    price: "",
    format: "",
  });

  const fetchData = async () => {
    try {
      const movieRes = await axios.get("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies");
      const showtimeRes = await axios.get("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/showtimes");

      setMovies(movieRes.data.movies || []);
      setShowtimes(showtimeRes.data.showtimes || []);
    } catch (error) {
      console.error("Admin verileri alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/showtimes", {
        movieId: Number(formData.movieId),
        hall: formData.hall,
        date: formData.date,
        time: formData.time,
        price: Number(formData.price),
        format: formData.format,
      });

      setFormData({
        movieId: "",
        hall: "",
        date: "",
        time: "",
        price: "",
        format: "",
      });

      fetchData();
    } catch (error) {
      console.error("Seans eklenemedi:", error.response?.data || error);
      alert("Seans eklenemedi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/showtimes/${id}`);
      fetchData();
    } catch (error) {
      console.error("Seans silinemedi:", error.response?.data || error);
      alert("Seans silinemedi.");
    }
  };

  return (
    <section className="admin-movies">
      <div className="container">
        <h1>Seans Yönetimi</h1>

        <form className="admin-movies__form" onSubmit={handleSubmit}>
          <select
            name="movieId"
            value={formData.movieId}
            onChange={handleChange}
            required
          >
            <option value="">Film Seç</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>

          <input
            name="hall"
            placeholder="Salon"
            value={formData.hall}
            onChange={handleChange}
            required
          />

          <input
            name="date"
            placeholder="Tarih"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            name="time"
            placeholder="Saat"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            placeholder="Fiyat"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            name="format"
            placeholder="2D / IMAX / 3D"
            value={formData.format}
            onChange={handleChange}
            required
          />

          <button type="submit">Seans Ekle</button>
        </form>

        <div className="admin-movies__list">
          {showtimes.map((showtime) => (
            <div className="admin-movies__card" key={showtime.id}>
              <div>
                <h3>{showtime.movieTitle}</h3>
                <p>
                  {showtime.date} - {showtime.time}
                </p>
                <p>
                  {showtime.hall} - {showtime.format} - {showtime.price} ₺
                </p>
              </div>

              <button onClick={() => handleDelete(showtime.id)}>Sil</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminShowtimes;