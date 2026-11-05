import prisma from "../lib/prisma.js";

const userSelect = { id: true, name: true, avatarUrl: true };

// Logged-in: my conversations, newest first, one per person and listing
export const getConversations = async (req, res, next) => {
  try {
    const me = req.user.id;
    const messages = await prisma.chatMessage.findMany({
      where: { OR: [{ senderId: me }, { receiverId: me }] },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: userSelect },
        receiver: { select: userSelect },
        listing: { select: { id: true, title: true } },
      },
    });

    const conversations = new Map();
    for (const m of messages) {
      const partner = m.senderId === me ? m.receiver : m.sender;
      const key = `${partner.id}-${m.listingId ?? 0}`;
      if (!conversations.has(key)) {
        conversations.set(key, {
          partner,
          listing: m.listing,
          listingId: m.listingId,
          lastMessage: m.body,
          lastAt: m.createdAt,
          unread: 0,
        });
      }
      if (m.receiverId === me && !m.readAt) {
        conversations.get(key).unread++;
      }
    }
    res.json({ conversations: [...conversations.values()] });
  } catch (err) {
    next(err);
  }
};

// Logged-in: the number of unread messages, for the navbar badge
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await prisma.chatMessage.count({
      where: { receiverId: req.user.id, readAt: null },
    });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// Logged-in: all messages with one person about one listing (or none).
// Opening the thread marks their messages to me as read.
export const getThread = async (req, res, next) => {
  try {
    const me = req.user.id;
    const partnerId = Number(req.params.userId);
    const listingId = req.query.listingId ? Number(req.query.listingId) : null;
    if (!Number.isInteger(partnerId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        listingId,
        OR: [
          { senderId: me, receiverId: partnerId },
          { senderId: partnerId, receiverId: me },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    await prisma.chatMessage.updateMany({
      where: { listingId, senderId: partnerId, receiverId: me, readAt: null },
      data: { readAt: new Date() },
    });

    res.json({ messages });
  } catch (err) {
    next(err);
  }
};

// Logged-in: send a message to another user, optionally about a listing
export const sendMessage = async (req, res, next) => {
  try {
    const me = req.user.id;
    const receiverId = Number(req.body.receiverId);
    const body = String(req.body.body || "").trim();
    const listingId = req.body.listingId ? Number(req.body.listingId) : null;

    if (!Number.isInteger(receiverId)) {
      return res.status(400).json({ message: "Choose who to message" });
    }
    if (receiverId === me) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }
    if (!body || body.length > 1000) {
      return res.status(400).json({ message: "Message must be 1 to 1000 characters" });
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = await prisma.chatMessage.create({
      data: { body, senderId: me, receiverId, listingId },
    });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
};
