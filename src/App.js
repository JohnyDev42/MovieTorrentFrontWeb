import React, { useState, useEffect } from "react";
import "./App.css";
import MovieList from "./components/movie-list";
import MovieDetails from "./components/movie-details";
import MovieForm from "./components/movie-form";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";


function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditedMovie] = useState(null);
  const [token, setToken, removeCookie] = useCookies(["mr-token"]);

  useEffect(() => {
    fetch("http://localhost:8000/api/movies/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token['mr-token']}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => setMovies(resp))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (!token["mr-token"]) window.location.href = "/";
  }, [token]);

  useEffect(() => {
    if (!selectedMovie) setSelectedMovie(null);
  }, [movies]);

  const loadMovie = (movie) => {
    setSelectedMovie(movie);
    setEditedMovie(null);
  };
  const editClicked = (movie) => {
    setEditedMovie(movie);
    setSelectedMovie(null);
  };
  const updatedMovie = (movie) => {
    const newMovies = movies.map((mov) => {
      if (mov.id === movie.id) {
        return movie;
      }
      return mov;
    });
    setMovies(newMovies);
  };
  const newMovie = () => {
    setEditedMovie({ title: "", description: "" });
    setSelectedMovie(null);
  };
  const movieCreated = (movie) => {
    const newMovies = [...movies, movie];
    setMovies(newMovies);
  };
  const removeClicked = (movie) => {
    const newMovies = movies.filter((mov) => mov.id !== movie.id);

    setMovies(newMovies);
  };
  const logoutUser = () => {
    removeCookie(["mr-token"],{path:'/'});
    console.log("working");
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className='logo'>
          <FontAwesomeIcon icon={faFilm}></FontAwesomeIcon>
          Movie Rater
        </h1>
        <FontAwesomeIcon
          icon={faSignOutAlt}
          onClick={logoutUser}
        ></FontAwesomeIcon>
      </header>
      <div className="layout">
        <div>
          <MovieList
            movies={movies}
            movieClicked={loadMovie}
            editClicked={editClicked}
            removeClicked={removeClicked}
          />
          <button onClick={newMovie}>New Movie</button>
        </div>
        {editedMovie ? (
          <MovieForm
            movie={editedMovie}
            updatedMovie={updatedMovie}
            movieCreated={movieCreated}
          />
        ) : null}
        <MovieDetails movie={selectedMovie} updateMovie={loadMovie} />
      </div>
    </div>
  );
}

export default App;
