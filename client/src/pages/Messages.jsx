import PageShell from "../components/ui/PageShell.jsx";

export default function Messages() {
  return (
    <PageShell title="Messages" subtitle="Chat with renters and owners (Phase 2).">
      <div className="grid overflow-hidden rounded-xl bg-surface shadow-sm md:grid-cols-[260px_1fr]">
        <div className="border-r border-border p-4 text-muted">No conversations yet.</div>
        <div className="min-h-64 p-4 text-muted">Select a conversation.</div>
      </div>
    </PageShell>
  );
}
