import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

export default function Messages() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const withId = params.get("with") ? Number(params.get("with")) : null;
  const urlListingId = params.get("listing") ? Number(params.get("listing")) : null;

  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const listRef = useRef(null);

  function loadConversations() {
    api.get("/messages/conversations")
      .then((r) => setConversations(r.data.conversations))
      .catch(() => {});
  }

  useEffect(() => {
    if (!user) return;
    loadConversations();
    if (withId) {
      api.get(`/owners/${withId}`)
        .then((r) => setActive({ partnerId: withId, listingId: urlListingId, name: r.data.owner.name, listingTitle: null }))
        .catch(() => {});
    }
  }, [user, withId, urlListingId]);

  // Load the thread, refresh it every 4 seconds, and refresh the list so unread counts update
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    function load() {
      const q = active.listingId ? `?listingId=${active.listingId}` : "";
      api.get(`/messages/with/${active.partnerId}${q}`)
        .then((r) => {
          if (cancelled) return;
          setMessages(r.data.messages);
          loadConversations();
        })
        .catch(() => {});
    }
    load();
    const timer = setInterval(load, 4000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [active]);

  // Scroll only the chat box, and only when a new message arrives
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, active]);

  function openConversation(c) {
    setError("");
    setActive({
      partnerId: c.partner.id,
      listingId: c.listingId,
      name: c.partner.name,
      listingTitle: c.listing?.title || null,
    });
    // Clear the badge right away, before the server answers
    setConversations((list) =>
      list.map((x) => (x.partner.id === c.partner.id && x.listingId === c.listingId ? { ...x, unread: 0 } : x))
    );
  }

  async function send(e) {
    e?.preventDefault();
    const body = text.trim();
    if (!body || !active) return;
    setError("");
    try {
      const res = await api.post("/messages", {
        receiverId: active.partnerId,
        listingId: active.listingId,
        body,
      });
      setMessages((m) => [...m, res.data.message]);
      setText("");
      loadConversations();
    } catch (err) {
      setError(err.response?.data?.message || t("messages.sendError"));
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) send(e);
  }

  if (loading) return <PageShell title={t("messages.title")}><p className="text-muted">{t("common.loading")}</p></PageShell>;
  if (!user) {
    return (
      <PageShell title={t("messages.title")}>
        <p className="text-muted"><Link to="/login" className="font-semibold text-primary underline">{t("nav.login")}</Link> {t("messages.loginPrompt")}</p>
      </PageShell>
    );
  }

  return (
    <PageShell title={t("messages.title")} subtitle={t("messages.subtitle")}>
      <div className="grid h-[70vh] min-h-[420px] overflow-hidden rounded-3xl bg-surface shadow-xl shadow-primary/10 ring-1 ring-border md:grid-cols-[300px_1fr]">
        <aside className="flex flex-col overflow-y-auto border-b border-border md:border-b-0 md:border-r">
          {conversations.length === 0 && !active ? (
            <p className="p-6 text-sm text-muted">{t("messages.noConversations")}</p>
          ) : (
            conversations.map((c) => {
              const isActive = active && active.partnerId === c.partner.id && active.listingId === c.listingId;
              return (
                <button
                  key={`${c.partner.id}-${c.listingId}`}
                  onClick={() => openConversation(c)}
                  className={`flex flex-col gap-1 border-b border-border/60 p-4 text-left transition-colors ${isActive ? "bg-primary/10" : "hover:bg-bg"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-bold">{c.partner.name}</span>
                    {c.unread > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">{c.unread}</span>
                    )}
                  </span>
                  {c.listing && <span className="text-xs font-semibold text-primary">{c.listing.title}</span>}
                  <span className="truncate text-sm text-muted">{c.lastMessage}</span>
                </button>
              );
            })
          )}
        </aside>

        <div className="flex min-h-0 flex-col">
          {!active ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center text-muted">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><MessageCircle size={26} /></span>
              <p>{t("messages.selectConversation")}</p>
            </div>
          ) : (
            <>
              <div className="border-b border-border p-4">
                <p className="font-bold">{active.name}</p>
                {active.listingTitle && <p className="text-sm text-primary">{t("messages.aboutListing")}: {active.listingTitle}</p>}
              </div>

              <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                {messages.length === 0 && <p className="m-auto text-sm text-muted">{t("messages.noMessages")}</p>}
                {messages.map((m) => {
                  const mine = m.senderId === user.id;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${mine ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-bg text-text"}`}>
                        <p className="whitespace-pre-wrap break-words">{m.body}</p>
                        <p className={`mt-1 text-[11px] ${mine ? "text-white/70" : "text-muted"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {error && <p className="mx-4 mb-2 rounded-2xl bg-danger/10 p-2 text-sm text-danger">{error}</p>}

              <form onSubmit={send} className="flex items-end gap-2 border-t border-border p-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  maxLength={1000}
                  placeholder={t("messages.placeholder")}
                  className="max-h-32 flex-1 resize-none rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-primary-hover disabled:opacity-40"
                  aria-label={t("messages.send")}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
