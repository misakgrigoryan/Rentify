import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import ListingCard from "../components/listing/ListingCard.jsx";
import { listings } from "../data/listings.js";

const categories = ["Tools", "Drones", "Projectors", "Sports", "Costumes"];

export default function Home() {
  return (
    <div>
      <section className="bg-primary px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold md:text-5xl">Rent anything, for a day or an hour</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">
            Tools, drones, projectors and sports gear from people near you. Rent what you need instead of buying it.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/products">
              <Button size="lg" variant="secondary">Browse items</Button>
            </Link>
            <Link to="/listings/new">
              <Button size="lg" className="bg-accent text-text hover:opacity-90">List your item</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              to="/products"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="text-2xl font-semibold">Featured listings</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {listings.slice(0, 4).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {["Find an item", "Send a request", "Pick it up and return it"].map((step, i) => (
            <div key={step} className="rounded-xl bg-surface p-6 shadow-sm">
              <span className="text-3xl font-bold text-primary">{i + 1}</span>
              <p className="mt-2 font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
