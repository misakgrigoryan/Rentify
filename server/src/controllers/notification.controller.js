import prisma from "../lib/prisma.js";

// Logged-in: counts for the navbar bell
export const getSummary = async (req, res, next) => {
  try {
    const me = req.user.id;
    const [unreadMessages, pendingRequests] = await Promise.all([
      prisma.chatMessage.count({ where: { receiverId: me, readAt: null } }),
      prisma.booking.count({ where: { status: "PENDING", listing: { ownerId: me } } }),
    ]);
    res.json({ unreadMessages, pendingRequests });
  } catch (err) {
    next(err);
  }
};
