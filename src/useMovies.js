import { useState, useEffect } from "react";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // callback?.();

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=8c4c0d09&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching moviess");

        const data = await res.json();
        if (data.Response === "False") throw new Error("MOVIE NOT FOUND");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        console.error(err);

        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
      // console.log(data.Search);
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
