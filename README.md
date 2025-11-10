# usePopcorn App - Component Structure & File Connections

## Overview

Use popcorn is a React application project which is used to learn react, state, hooks(useState, useEffekt), props,env.
the application get data from an API called OMDB API so the user can search for movies, add to a list of watched movies, rate the movies, and delete.

## Environment Variables

-   `REACT_APP_API_KEY`= OMDB API key (accessed in `App.js`)
-   `OMDB api link`: https://www.omdbapi.com/

---

## Entry Point

### `index.js`

-   **Role**: Application entry point
-   **Connections**:
    -   Imports `App` from `./App`
    -   Imports `index.css` for global styles
    -   Renders `<App />` into the DOM root element
-   **Flow**: `index.js` → `App.js`

---

## Main Application Component

### `App.js`

-   **Role**: Main container component that manages all application state
-   **State Management**:
    -   `movies`: Array of search results from API
    -   `watched`: Array of movies the user has watched and rated
    -   `isLoading`: Loading state for API calls
    -   `error`: Error messages from API
    -   `query`: Search query string
    -   `selectedId`: ID of currently selected movie
-   **Key Functions**:
    -   `handleSelectedId()`: Toggles movie selection
    -   `handleCloseMovie()`: Closes selected movie view
    -   `handleDeleteWatched()`: Removes movie from watched list
    -   `handleAddWatched()`: Adds movie to watched list
    -   `fetchMovies()`: Fetches movies from OMDB API based on query
-   **Exports**:
    -   `ApiKey`: API key for OMDB (from environment variables)
    -   `average()`: Utility function to calculate averages
    -   `Load`: Loading component
-   **Component Structure**:
    ```
    App
    ├── NavBar
    │   ├── Logo
    │   ├── Search
    │   └── NumResults
    └── Main
        ├── Box (Search Results)
        │   ├── Load (conditional)
        │   ├── ErrorMessage (conditional)
        │   └── MovieList
        │       └── Movie (multiple)
        └── Box (Watched Movies)
            ├── SelectedMovie (conditional)
            │   └── StarRating
            └── WatchedSummary + WatchedMoviesList (conditional)
                └── WatchedMovie (multiple)
    ```

---

## Navigation Components

### `NavBar.js`

-   **Role**: Navigation bar wrapper
-   **Connections**:
    -   Imports `Logo` from `./Logo`
    -   Receives `children` (Search and NumResults) from `App`
-   **Children**: Renders Logo and any children passed from App

### `Logo.js`

-   **Role**: Displays the app logo and title
-   **Connections**: Used by `NavBar`
-   **Output**: 🍿 usePopcorn

### `Search.js`

-   **Role**: Search input component
-   **Props**:
    -   `query`: Current search query (from App state)
    -   `setQuery`: Function to update query (from App)
-   **Connections**: Used by `App`, passed to `NavBar` as child
-   **Data Flow**: User input → `setQuery` → Updates `query` in App → Triggers API call

### `NumResults.js`

-   **Role**: Displays number of search results
-   **Props**: `movies` (array from App state)
-   **Connections**: Used by `App`, passed to `NavBar` as child
-   **Output**: "Found X results"

---

## Main Content Area

### `Main.js`

-   **Role**: Main content wrapper
-   **Connections**: Receives `children` from `App` (two Box components)
-   **Structure**: Simple wrapper that renders children in a main element

### `Box.js`

-   **Role**: Collapsible container component
-   **Props**: `children` (any React components)
-   **State**: `isOpen` (boolean) - controls visibility
-   **Connections**:
    -   Used twice in `App`:
        1. Contains search results (MovieList)
        2. Contains watched movies (SelectedMovie or WatchedSummary/WatchedMoviesList)
-   **Features**: Toggle button to show/hide content

---

## Movie List Components

### `MovieList.js`

-   **Role**: Container for list of search result movies
-   **Props**:
    -   `movies`: Array of movie objects
    -   `selectedId`: Function to set selected movie ID
-   **Connections**:
    -   Receives movies from `App`
    -   Renders multiple `Movie` components
    -   Imports `Movie` from `./Movie`

### `Movie.js`

-   **Role**: Individual movie item in search results
-   **Props**:
    -   `movie`: Movie object with Title, Year, Poster, imdbID
    -   `onSelected`: Function to handle movie selection
-   **Connections**: Used by `MovieList`
-   **Interaction**: Clicking a movie calls `onSelected(movie.imdbID)` → Updates `selectedId` in App

---

## Selected Movie Component

### `SelectedMovie.js`

-   **Role**: Displays detailed view of selected movie
-   **Props**:
    -   `selectedId`: ID of selected movie
    -   `closeSelected`: Function to close this view
    -   `onAddWatched`: Function to add movie to watched list
    -   `watched`: Array of watched movies
-   **State**:
    -   `movie`: Full movie details from API
    -   `isLoading`: Loading state for movie details
    -   `userRating`: User's rating (from StarRating)
-   **Connections**:
    -   Imports `StarRating` from `./StarRating`
    -   Imports `ApiKey` and `Load` from `./App`
    -   Fetches movie details from OMDB API when `selectedId` changes
-   **Features**:
    -   Displays movie poster, title, plot, actors, director
    -   Shows StarRating component for user to rate
    -   "Add to list" button appears after rating
    -   Escape key closes the view
    -   Updates document title with movie title

---

## Watched Movies Components

### `WatchedSummary.js`

-   **Role**: Displays statistics about watched movies
-   **Props**: `watched` (array of watched movies)
-   **Connections**:
    -   Imports `average` function from `./App`
    -   Used by `App` in the second Box
-   **Calculations**:
    -   Average IMDB rating
    -   Average user rating
    -   Average runtime
    -   Total number of movies

### `WatchedMoviesList.js`

-   **Role**: Container for list of watched movies
-   **Props**:
    -   `watched`: Array of watched movies
    -   `onDelete`: Function to delete a movie from watched list
-   **Connections**:
    -   Imports `WatchedMovie` from `./WatchedMovie`
    -   Renders multiple `WatchedMovie` components
    -   Used by `App` in the second Box

### `WatchedMovie.js`

-   **Role**: Individual watched movie item
-   **Props**:
    -   `movie`: Watched movie object
    -   `onDelete`: Function to delete this movie
-   **Connections**: Used by `WatchedMoviesList`
-   **Display**: Shows poster, title, IMDB rating, user rating, runtime, and delete button

---

## Utility Components

### `StarRating.jsx`

-   **Role**: Reusable star rating component
-   **Props**:
    -   `maxRating`: Maximum number of stars (default: 5)
    -   `size`: Size of stars
    -   `color`: Color of stars
    -   `onRating`: Callback function when rating is selected
-   **State**:
    -   `rating`: Current rating
    -   `tempRating`: Temporary rating on hover
-   **Connections**: Used by `SelectedMovie`
-   **Features**: Interactive star rating with hover effects

---

## Data Files

### `dummyData.js`

-   **Role**: Contains sample/temporary data
-   **Exports**:
    -   `tempMovieData`: Array of sample movies
    -   `tempWatchedData`: Array of sample watched movies
-   **Connections**:
    -   Imported by `App.js` for initial state
    -   Used as fallback when no search results

---

## Data Flow Summary

### Search Flow:

1. User types in `Search` → `setQuery` updates `query` in `App`
2. `useEffect` in `App` triggers when `query` changes
3. API call to OMDB fetches movies
4. Results stored in `movies` state
5. `MovieList` renders `Movie` components
6. `NumResults` displays count

### Movie Selection Flow:

1. User clicks `Movie` → `onSelected(movie.imdbID)` called
2. `selectedId` state updated in `App`
3. `SelectedMovie` component renders
4. `SelectedMovie` fetches full movie details from API
5. User can rate movie using `StarRating`
6. User clicks "Add to list" → `handleAddWatched` called
7. Movie added to `watched` array
8. `selectedId` set to null → Shows watched list again

### Watched List Flow:

1. `watched` array updated in `App`
2. `WatchedSummary` calculates and displays statistics
3. `WatchedMoviesList` renders `WatchedMovie` components
4. User can delete movies → `handleDeleteWatched` called
5. Movie removed from `watched` array

---

## Key Patterns Used

1. **State Lifting**: All state managed in `App.js`, passed down as props
2. **Composition**: Uses `children` prop pattern (Box, NavBar, Main)
3. **Conditional Rendering**: Multiple conditional renders based on state
4. **Side Effects**: `useEffect` for API calls and cleanup
5. **Event Handling**: Functions passed down as props for child-to-parent communication
6. **Controlled Components**: Search input is controlled by App state

---

## File Dependencies Graph

```
index.js
  └── App.js
      ├── dummyData.js (imports temp data)
      ├── NavBar.js
      │   └── Logo.js
      ├── Search.js
      ├── NumResults.js
      ├── Main.js
      ├── Box.js (used twice)
      ├── MovieList.js
      │   └── Movie.js
      ├── SelectedMovie.js
      │   └── StarRating.jsx
      ├── WatchedSummary.js (imports average from App)
      └── WatchedMoviesList.js
          └── WatchedMovie.js
```

---

## Styling

-   `index.css`: Global styles applied to entire application
-   Imported in `index.js`
