import { useEffect, useState } from "react";
import { tempMovieData, tempWatchedData } from "./dummyData";
import { MovieList } from "./MovieList";
import { SelectedMovie } from "./SelectedMovie";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { Main } from "./Main";
import { NavBar } from "./NavBar";
import { Search } from "./Search";
import { NumResults } from "./NumResults";
import { Box } from "./Box";
//*********************************************************************************************************
export const ApiKey = process.env.REACT_APP_API_KEY;
export const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//*********************************************************************************************************
export function Load() {
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
    const controller = new AbortController();

    function handleSelectedId(id) {
        setSelectedId((selectedId) => (id === selectedId ? null : id));
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }
    // deletes selected movie from watched list
    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }
    // sets the whatched list
    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    useEffect(
        function () {
            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");
                    const res = await fetch(
                        `http://www.omdbapi.com/?apikey=${ApiKey}&s=${query}`,
                        { signal: controller.signal }
                    );
                    if (!res.ok)
                        throw new Error("Something went wrong when fetching");
                    const data = await res.json();
                    console.log(data);
                    if (data.Response === "False") throw new Error(data.Error);
                    setMovies(data.Search);
                } catch (err) {
                    console.error(err.message);
                    if (err.name !== "AbortError") setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }

            handleCloseMovie(); // stops displaying the selectedmovie component when new search is started
            fetchMovies();
            return function () {
                controller.abort();
            };
        },
        [query]
    );
    //*********************************************************************************************************˚
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
