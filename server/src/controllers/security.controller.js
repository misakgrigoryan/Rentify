import { getSecuritySummary } from "../utils/securityLog.js";

// Super Admin only
export const getSecurity = (req, res) => {
  res.json(getSecuritySummary());
};
