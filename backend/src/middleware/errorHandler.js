export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Prisma Errors
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Duplicate entry",
      message: `${err.meta?.target?.[0] || "Field"} already exists`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Not found",
      message: "Record not found",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(404).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
