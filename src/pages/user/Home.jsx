import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import MovieCard from "../../components/movie/MovieCard";

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const nowShowingSliderRef = useRef(null);
  const comingSoonSliderRef = useRef(null);

  const scrollSlider = (ref, direction) => {
    ref.current?.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);

        const nowRes = await fetch("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies/now-showing");
        const comingRes = await fetch("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/movies/coming-soon");

        const nowData = await nowRes.json();
        const comingData = await comingRes.json();

        setNowShowing(nowData.movies || []);
        setComingSoon(comingData.movies || []);
      } catch (error) {
        console.error("Film çekme hatası:", error);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, []);

  const movies = nowShowing;
  const activeMovie = movies[activeIndex];

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % movies.length);
  };

  return (
    <>
      <section
        className="home-hero-slider"
        style={{
          backgroundImage: activeMovie
            ? `linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0.35) 100%), url(${activeMovie.image})`
            : "none",
        }}
      >
        <div className="container home-hero-slider__container">
          <div className="home-hero-slider__content">
            <span className="home-hero-slider__badge">Vizyonda</span>

            <h1 className="home-hero-slider__title">
              {activeMovie?.title || "Eden Cineverse"}
            </h1>

            <p className="home-hero-slider__text">
              {activeMovie?.description ||
                "Vizyondaki filmleri keşfet, seansını seç ve koltuğunu ayırt."}
            </p>

            <div className="home-hero-slider__meta">
              <span>⭐ {activeMovie?.rating || "N/A"}</span>
              <span>{activeMovie?.duration || "Bilinmiyor"}</span>
              <span>{activeMovie?.genre || "Film"}</span>
            </div>

            <div className="home-hero-slider__actions">
              {activeMovie && (
                <Link to={`/movies/${activeMovie.id}`} className="home-hero-slider__primary-btn">
                  İncele
                </Link>
              )}

              <a href="#featured-movies" className="home-hero-slider__secondary-btn">
                Filmleri Keşfet
              </a>
            </div>
          </div>

          {!loadingMovies && movies.length > 0 && (
            <div className="home-hero-slider__posters">
         {movies
  .slice(
    Math.floor(activeIndex / 4) * 4,
    Math.floor(activeIndex / 4) * 4 + 4
  )
  .map((movie, index) => {
    const realIndex = Math.floor(activeIndex / 4) * 4 + index;

    return (
      <button
        key={movie.id}
        className={`home-hero-slider__poster ${
          activeIndex === realIndex ? "active" : ""
        }`}
        onClick={() => setActiveIndex(realIndex)}
        type="button"
      >
        <img src={movie.image} alt={movie.title} />
      </button>
    );
  })}
            </div>
          )}

          {!loadingMovies && movies.length > 0 && (
            <div className="home-hero-slider__controls">
              <button onClick={handlePrev}>‹</button>
              <span>{activeIndex + 1} / {movies.length}</span>
              <button onClick={handleNext}>›</button>
            </div>
          )}
        </div>
      </section>

      <section className="featured-movies" id="featured-movies">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-header__subtitle">Vizyondakiler</p>
              <h2 className="section-header__title">Öne Çıkan Filmler</h2>
            </div>
          </div>

          {loadingMovies ? (
            <p className="home-loading-text">Yükleniyor...</p>
          ) : (
            <div className="slider-wrapper">
              <button className="slider-btn left" onClick={() => scrollSlider(nowShowingSliderRef, "left")}>
                ‹
              </button>

              <div ref={nowShowingSliderRef} className="featured-movies__slider">
                {nowShowing.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              <button className="slider-btn right" onClick={() => scrollSlider(nowShowingSliderRef, "right")}>
                ›
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="featured-movies">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-header__subtitle">Yakında</p>
              <h2 className="section-header__title">Vizyona Girecekler</h2>
            </div>
          </div>

          {loadingMovies ? (
            <p className="home-loading-text">Yükleniyor...</p>
          ) : (
            <div className="slider-wrapper">
              <button className="slider-btn left" onClick={() => scrollSlider(comingSoonSliderRef, "left")}>
                ‹
              </button>

              <div ref={comingSoonSliderRef} className="featured-movies__slider">
                {comingSoon.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              <button className="slider-btn right" onClick={() => scrollSlider(comingSoonSliderRef, "right")}>
                ›
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;