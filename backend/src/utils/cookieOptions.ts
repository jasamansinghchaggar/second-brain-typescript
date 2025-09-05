export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
  maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
};
