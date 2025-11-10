import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { ApiKey, Load } from "./App";

//*********************************************************************************************************
export function SelectedMovie({
    selectedId,
    closeSelected,
    onAddWatched,
    watched,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");
    // check if an movie with a certain ID alredy exists in the watched array
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

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

    useEffect(() => {
        function callBack(e) {
            if (e.code === "Escape") closeSelected();
            console.log("Closing");
        }
        document.addEventListener("keydown", callBack);
        return function () {
            document.removeEventListener("keydown", callBack);
        };
    }, [closeSelected]);

    useEffect(
        function () {
            async function getMovieDetails() {
                try {
                    setIsLoading(true);
                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=${ApiKey}&i=${selectedId}`
                    );

                    if (!res.ok) {
                        throw new Error(
                            "Something went wrong when fetching movie details"
                        );
                    }

                    const data = await res.json();

                    if (data.Response === "False") {
                        throw new Error(data.Error);
                    }

                    setMovie(data);
                    console.log(data);
                } catch (err) {
                    console.error(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            getMovieDetails();
        },
        [selectedId]
    );

    useEffect(() => {
        if (!title) return;
        document.title = `Movie | ${title}`;
        return () => {
            document.title = "usePopcorn";
        };
    }, [title]);
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
