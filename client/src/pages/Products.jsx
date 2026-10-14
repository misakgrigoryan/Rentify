import { useState } from "react";
import ListingCard from "../components/listing/ListingCard.jsx";
import Input from "../components/ui/Input.jsx";
import { listings } from "../data/listings.js";

// Filters the sample listings by name and category.
// Week 4 will move this filtering to the backend.
export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(listings.map((l) => l.category))];

  const results = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Browse items</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-sm">
          <Input
            id="search"
            label="Search"
            placeholder="Drill, drone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Category</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-lg px-3 py-1.5 text-left text-sm ${
                  category === c ? "bg-primary text-white" : "hover:bg-bg"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        <div>
          <p className="mb-3 text-sm text-muted">{results.length} items found</p>
          {results.length === 0 ? (
            <p className="rounded-xl bg-surface p-6 text-muted">No items match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
