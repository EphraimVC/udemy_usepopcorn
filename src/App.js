import { useEffect, useState } from "react";
import { tempMovieData, tempWatchedData } from "./dummyData";

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Load() {
    return <p className="loader">loading</p>;
}

function ErrorMessage({ message }) {
    return (
        <div className="error">
            <span>❌</span> <p>{message}</p>
        </div>
    );
}

const ApiKey = "d7fee4ed";

export default function App() {
    const [movies, setMovies] = useState(tempMovieData);
    const [watched, setWatched] = useState(tempWatchedData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const query = "sdgsdg";

    useEffect(function () {
        async function fetchMovies() {
            try {
                setIsLoading(true);
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${ApiKey}&s=${query}`
                );
                if (!res.ok)
                    throw new Error("Something went wrong when fetching");
                const data = await res.json();
                console.log(data);
                if (data.Response === "False") throw new Error(data.Error);
                setMovies(data.Search);
            } catch (err) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMovies();
    }, []);
    return (
        <div>
            <NavBar>
                <Search />
                <NumResults movies={movies} />
            </NavBar>
            <Main>
                <Box>
                    {/* {isLoading ? <Load /> : <MovieList movies={movies} />} */}
                    {isLoading && <Load />}
                    {!isLoading && !error && <MovieList movies={movies} />}
                    {error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    <WatchedSummary watched={watched} />
                    <WatchedMoviesList watched={watched} />
                </Box>
            </Main>
        </div>
    );
}
function Main({ children }) {
    return <main className="main">{children}</main>;
}
function NavBar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}
function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}

function Search() {
    const [query, setQuery] = useState("");
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}

function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({ watched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie }) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
            </div>
        </li>
    );
}

function MovieList({ movies }) {
    return (
        <ul className="list">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    );
}

function Movie({ movie }) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}
