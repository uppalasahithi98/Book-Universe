"use client";

import { useState } from "react";

type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
};

const categories = [
  "All Books",
  "Fiction",
  "Fantasy",
  "Romance",
  "Mystery",
  "Science",
  "Technology",
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Books");
  const [showCategories, setShowCategories] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function searchBooks(
    query: string,
    category = activeCategory
  ) {
    const searchTerm = query.trim();

    if (!searchTerm && category === "All Books") {
      setBooks([]);
      setHasSearched(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = new URLSearchParams();

      params.set(
        "q",
        searchTerm || category
      );

      params.set("limit", "20");

      params.set(
        "fields",
        "key,title,author_name,first_publish_year,cover_i,subject"
      );

      const response = await fetch(
        `https://openlibrary.org/search.json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch books");
      }

      const data = await response.json();
      const results: Book[] = data.docs ?? [];

      setBooks(results);
    } catch {
      setBooks([]);
      setError("Unable to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    searchBooks(search);
  }

  function handleCategory(category: string) {
    setActiveCategory(category);
    setSearch("");
    searchBooks("", category);
  }

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-[#183c2e]">
      {/* Navigation */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#"
          className="text-2xl font-bold tracking-tight"
        >
          Book Universe
        </a>

        <nav className="flex items-center gap-4 text-sm sm:gap-6 md:gap-8 md:text-base">
          <a
            href="#explore"
            className="hover:text-[#b77945]"
          >
            Explore
          </a>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowCategories(!showCategories)
              }
              className="hover:text-[#b77945]"
            >
              Categories
            </button>

            {showCategories && (
              <div className="absolute left-0 top-full z-20 mt-3 min-w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      handleCategory(category);
                      setShowCategories(false);

                      document
                        .getElementById("explore")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                    className={`block w-full rounded-lg px-4 py-2 text-left text-sm hover:bg-[#f8f6ef] ${
                      activeCategory === category
                        ? "font-semibold text-[#183c2e]"
                        : "text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#about"
            className="hover:text-[#b77945]"
          >
            About
          </a>
        </nav>
      </header>

      {/* Main Search Section */}
      <section className="px-6 py-12 text-center md:px-12 md:py-16">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
          Find your next favorite book.
        </h1>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by book title or author"
            aria-label="Search by book title or author"
            className="min-w-0 flex-1 rounded-full border border-gray-300 bg-white px-6 py-4 outline-none focus:border-[#183c2e]"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#183c2e] px-8 py-4 font-semibold text-white hover:bg-[#285741] disabled:opacity-60"
          >
            {loading ? "Searching..." : "Find My Book"}
          </button>
        </form>
      </section>

      {/* Book Results */}
      <section
        id="explore"
        className="px-6 py-12 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold md:text-4xl">
              Explore Books
            </h2>

            <p className="mt-2 text-gray-600">
              Find your next favorite book.
            </p>
          </div>

          {activeCategory !== "All Books" && (
            <p className="mb-6 text-sm text-gray-600">
              Selected category: {activeCategory}
            </p>
          )}

          {loading && (
            <p className="py-10 text-center text-gray-600">
              Finding books...
            </p>
          )}

          {error && (
            <p className="py-6 text-center text-red-600">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            hasSearched &&
            books.length === 0 && (
              <p className="py-10 text-center text-gray-600">
                No books found. Try another search.
              </p>
            )}

          {!loading && books.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((book) => (
                <article
                  key={book.key}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Book Cover */}
                  <div className="flex h-64 items-center justify-center bg-[#eee9dc] p-4">
                    {book.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={`Cover of ${book.title}`}
                        className="h-full max-w-full rounded-md object-contain shadow-md"
                      />
                    ) : (
                      <div className="px-5 text-center">
                        <p className="text-lg font-bold">
                          {book.title}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          Cover unavailable
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Book Information */}
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-lg font-bold">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {book.author_name?.join(", ") ||
                        "Unknown Author"}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {book.first_publish_year
                        ? `Published in ${book.first_publish_year}`
                        : "Publication year unavailable"}
                    </p>

                    <a
                      href={`https://openlibrary.org${book.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-block rounded-full border border-[#183c2e] px-5 py-2 text-sm font-semibold text-[#183c2e] hover:bg-[#183c2e] hover:text-white"
                    >
                      View Book
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="rounded-2xl bg-[#eee9dc] px-6 py-12 text-center">
              <h3 className="text-2xl font-bold">
                Your next favorite book awaits
              </h3>

              <p className="mt-3 text-gray-600">
                Search for a title or author, or choose a category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-[#183c2e] px-6 py-16 text-white md:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#e6b77b]">
              About Book Universe
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Every book opens a new world.
            </h2>
          </div>

          <p className="text-base leading-8 text-gray-200">
            Discover books by title, author, or category.
            Explore book covers and publication details,
            and visit Open Library to learn more.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center md:px-12">
        <p className="font-bold">
          Book Universe
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Discover stories. Explore knowledge.
        </p>

        <p className="mt-4 text-xs text-gray-500">
          Book information and covers provided by Open Library.
        </p>

        <p className="mt-2 text-xs text-gray-500">
          © 2026 Book Universe
        </p>
      </footer>
    </main>
  );
}