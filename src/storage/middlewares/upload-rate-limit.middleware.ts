import rateLimit from "express-rate-limit";

export const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many uploads, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
