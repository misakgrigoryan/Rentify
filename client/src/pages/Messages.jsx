import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Package } from "lucide-react";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

const GRADIENTS = [
  "from-primary to-[#8f3b25]",
  "from-accent to-warning",
  "from-info to-primary",
  "from-success to-info",
];

// Round photo, or the first letter on a colored circle when there is no photo
function Avatar({ user, size = "h-11 w-11", text = "text-base" }) {
  const letter = (user?.name || "?").trim().charAt(0).toUpperCase();
  const g = GRADIENTS[(user?.id || 0) % GRADIENTS.length];
  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className={`${size} shrink-0 rounded-full object-cover ring-2 ring-surface`} />;
  }
  return (
    <span className={`${size} ${text} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${g} font-extrabold text-white ring-2 ring-surface`}>
      {letter}
    </span>
  );
}

function timeOf(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

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
        .then((r) => setActive({
          partnerId: withId,
          listingId: urlListingId,
          name: r.data.owner.name,
          avatarUrl: r.data.owner.avatarUrl,
          listingTitle: null,
        }))
        .catch(() => {});
    }
  }, [user, withId, urlListingId]);

  // Refresh the thread every 4 seconds and keep the conversation list in sync
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

  // Scroll only inside the chat box
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
      avatarUrl: c.partner.avatarUrl,
      listingTitle: c.listing?.title || null,
    });
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
      <div className="grid h-[72vh] min-h-[440px] overflow-hidden rounded-[2rem] bg-surface shadow-2xl shadow-primary/10 ring-1 ring-border md:grid-cols-[320px_1fr]">

        {/* Conversation list */}
        <aside className="flex min-h-0 flex-col border-b border-border bg-bg/60 md:border-b-0 md:border-r">
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted">{t("messages.noConversations")}</p>
            ) : (
              conversations.map((c, i) => {
                const isActive = active && active.partnerId === c.partner.id && active.listingId === c.listingId;
                return (
                  <motion.button
                    key={`${c.partner.id}-${c.listingId}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => openConversation(c)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors ${isActive ? "bg-surface shadow-sm ring-1 ring-primary/30" : "hover:bg-surface/70"}`}
                  >
                    <Avatar user={c.partner} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-bold">{c.partner.name}</span>
                        <span className="shrink-0 text-[11px] text-muted">{timeOf(c.lastAt)}</span>
                      </span>
                      {c.listing && (
                        <span className="mt-0.5 flex items-center gap-1 truncate text-xs font-semibold text-primary">
                          <Package size={11} /> {c.listing.title}
                        </span>
                      )}
                      <span className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-sm text-muted">{c.lastMessage}</span>
                        {c.unread > 0 && (
                          <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{c.unread}</span>
                        )}
                      </span>
                    </span>
                  </motion.button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat window */}
        <div className="flex min-h-0 flex-col bg-gradient-to-b from-surface to-bg/40">
          {!active ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary"
              >
                <MessageCircle size={30} />
              </motion.span>
              <p className="text-muted">{t("messages.selectConversation")}</p>
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-border bg-surface/80 px-5 py-3 backdrop-blur">
                <Link to={`/owners/${active.partnerId}`} title={t("messages.viewProfile")} className="group flex min-w-0 items-center gap-3 rounded-2xl p-1 pr-3 transition hover:bg-bg">
                  <Avatar user={{ id: active.partnerId, name: active.name, avatarUrl: active.avatarUrl }} size="h-10 w-10" text="text-sm" />
                  <div className="min-w-0">
                    <p className="truncate font-bold group-hover:text-primary">{active.name}</p>
                    {active.listingTitle && (
                      <p className="flex items-center gap-1 truncate text-xs font-semibold text-primary">
                        <Package size={11} /> {t("messages.aboutListing")}: {active.listingTitle}
                      </p>
                    )}
                  </div>
                </Link>
              </header>

              <div ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-4">
                {messages.length === 0 && (
                  <p className="m-auto text-sm text-muted">{t("messages.noMessages")}</p>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((m) => {
                    const mine = m.senderId === user.id;
                    const partner = { id: active.partnerId, name: active.name, avatarUrl: active.avatarUrl };
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                      >
                        {!mine && <Avatar user={partner} size="h-7 w-7" text="text-[11px]" />}
                        <div
                          className={`max-w-[72%] px-4 py-2.5 text-sm shadow-sm ${
                            mine
                              ? "rounded-2xl rounded-br-md bg-gradient-to-br from-primary to-[#a6442a] text-white"
                              : "rounded-2xl rounded-bl-md bg-surface text-text ring-1 ring-border"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed">{m.body}</p>
                          <p className={`mt-1 text-right text-[10px] ${mine ? "text-white/70" : "text-muted"}`}>{timeOf(m.createdAt)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {error && <p className="mx-5 mb-2 rounded-2xl bg-danger/10 p-2 text-sm text-danger">{error}</p>}

              <form onSubmit={send} className="flex items-center gap-2 border-t border-border bg-surface p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={onKeyDown}
                  maxLength={1000}
                  placeholder={t("messages.placeholder")}
                  className="h-11 flex-1 rounded-full border-2 border-border bg-bg px-5 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.9 }}
                  disabled={!text.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#a6442a] text-white shadow-lg shadow-primary/30 transition disabled:opacity-40"
                  aria-label={t("messages.send")}
                >
                  <Send size={17} />
                </motion.button>
              </form>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
