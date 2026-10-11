export const getHealth = (req, res) => {
  res.json({
    status: "ok",
    service: "rentify-server",
    time: new Date().toISOString(),
  });
};
