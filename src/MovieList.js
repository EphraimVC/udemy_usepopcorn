import { Movie } from "./Movie";

//*********************************************************************************************************
export function MovieList({ movies, selectedId }) {
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
