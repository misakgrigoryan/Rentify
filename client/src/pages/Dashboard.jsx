import PageShell from "../components/ui/PageShell.jsx";

const tabs = ["My Listings", "Requests", "Active", "Finished"];

export default function Dashboard() {
  return (
    <PageShell title="Dashboard" subtitle="Manage your listings and rentals.">
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-semibold ${
              i === 0 ? "border-b-2 border-primary text-primary" : "text-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-xl bg-surface p-6 text-muted shadow-sm">No items yet.</div>
    </PageShell>
  );
}
