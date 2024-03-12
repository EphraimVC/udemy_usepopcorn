import { useEffect, useState } from "react";
import { tempMovieData, tempWatchedData } from "./dummyData";
import StarRating from "./StarRating";
//*********************************************************************************************************
const ApiKey = "d7fee4ed";
const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//*********************************************************************************************************
function Load() {
    return <p className="loader">loading</p>;
}
//*********************************************************************************************************
function ErrorMessage({ message }) {
    return (
        <div className="error">
            <span>❌</span> <p>{message}</p>
        </div>
    );
}
//*********************************************************************************************************

export default function App() {
    const [movies, setMovies] = useState(tempMovieData);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    function handleSelectedId(id) {
        setSelectedId((selectedId) => (id === selectedId ? null : id));
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }
    console.log(watched);

    useEffect(
        function () {
            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");
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
            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }

            fetchMovies();
        },
        [query]
    );
    return (
        <div>
            <NavBar>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </NavBar>
            <Main>
                {/* -------------searched movie result list------------------------ */}

                <Box>
                    {/* {isLoading ? <Load /> : <MovieList movies={movies} />} */}
                    {isLoading && <Load />}
                    {!isLoading && !error && (
                        <MovieList movies={movies} selectedId={setSelectedId} />
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>
                {/* // -------------watched movie box  ---------------------------------- */}

                <Box>
                    {selectedId ? (
                        <SelectedMovie
                            selectedId={selectedId}
                            closeSelected={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList
                                watched={watched}
                                onDelete={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </div>
    );
}
//*********************************************************************************************************
function MovieList({ movies, selectedId }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie
                    movie={movie}
                    key={movie.imdbID}
                    onSelected={selectedId}
                />
            ))}
        </ul>
    );
}
//*********************************************************************************************************
function Movie({ movie, onSelected }) {
    return (
        <li onClick={() => onSelected(movie.imdbID)}>
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
//*********************************************************************************************************
function SelectedMovie({ selectedId, closeSelected, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
    console.log(isWatched);
    const {
        Title: title,
        Year: year,
        Released: released,
        Runtime: runtime,
        Genre: genre,
        Plot: plot,
        Actors: actors,
        Director: director,
        imdbRating,
        Poster: poster,
    } = movie;

    function handleAddMovie() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        };
        onAddWatched(newWatchedMovie);
        closeSelected();
    }
    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true);
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${ApiKey}&i=${selectedId}`
                );
                const data = await res.json();
                setMovie(data);
                setIsLoading(false);
                console.log(data);
            }
            getMovieDetails();
        },
        [selectedId]
    );
    return (
        <>
            <div className="details">
                {isLoading ? (
                    <Load />
                ) : (
                    <>
                        <button className="btn-back" onClick={closeSelected}>
                            &larr;
                        </button>
                        <header>
                            <img src={poster} alt={`poster of${movie} movie`} />
                            <div className="details-overview">
                                <h2>{title}</h2>
                                <p>
                                    {released} &bull; {runtime}
                                </p>
                                <p>{genre}</p>
                                <p>
                                    <span>⭐️</span>
                                    {imdbRating} IMDB rating
                                </p>
                            </div>
                        </header>
                        <section>
                            <div className="rating">
                                {!isWatched ? (
                                    <>
                                        <StarRating
                                            maxRating={10}
                                            size={24}
                                            onRating={setUserRating}
                                        />
                                        {userRating > 0 ? (
                                            <button
                                                className="btn-add"
                                                onClick={handleAddMovie}
                                            >
                                                + Add to list
                                            </button>
                                        ) : (
                                            ""
                                        )}
                                    </>
                                ) : (
                                    <p>
                                        {" "}
                                        This movie is already added to the list
                                    </p>
                                )}
                            </div>
                            <em>{plot}</em>
                            <p>Staring {actors}</p>
                            <p>Directed by {director}</p>
                        </section>
                    </>
                )}
            </div>
        </>
    );
}

//*********************************************************************************************************
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
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}
//*********************************************************************************************************
function WatchedMoviesList({ watched, onDelete }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
//*********************************************************************************************************
function WatchedMovie({ movie, onDelete }) {
    return (
        <li>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
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

                <button
                    className="btn-delete"
                    onClick={() => onDelete(movie.imdbID)}
                >
                    X
                </button>
            </div>
        </li>
    );
}

//*************************************************************************************************************************************************

function Main({ children }) {
    return <main className="main">{children}</main>;
}

//*********************************************************************************************************
function NavBar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

//*********************************************************************************************************

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}
//*********************************************************************************************************

function Search({ query, setQuery }) {
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
//*********************************************************************************************************
function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}
//*********************************************************************************************************
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
