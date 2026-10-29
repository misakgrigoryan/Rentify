import { useEffect, useState } from "react";
import ListingCard from "../components/listing/ListingCard.jsx";
import Input from "../components/ui/Input.jsx";
import api from "../lib/api.js";

const categories = ["All", "Tools", "Drones", "Projectors", "Sports", "Costumes"];

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs again whenever the search text or category changes
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== "All") params.category = category;

    api
      .get("/listings", { params })
      .then((res) => {
        setListings(res.data.listings);
        setTotal(res.data.total);
        setError("");
      })
      .catch(() => setError("Could not load listings"))
      .finally(() => setLoading(false));
  }, [search, category]);

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
          {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
          <p className="mb-3 text-sm text-muted">
            {loading ? "Loading..." : `${total} items found`}
          </p>
          {!loading && listings.length === 0 ? (
            <p className="rounded-xl bg-surface p-6 text-muted">No items match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
