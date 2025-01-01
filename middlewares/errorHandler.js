export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);  // Log the error for debugging purposes
  
    if (err.name === "ValidationError") {
      // Validation error (e.g., from Mongoose or other ORM)
      return res.status(400).json({ message: err.message });
    }
  
    if (err.name === "CastError") {
      // Invalid MongoDB ObjectId error
      return res.status(400).json({ message: "Invalid resource ID" });
    }
  
    // Handle specific errors (like JWT errors, DB errors, etc.)
    if (err.message === "User not found" || err.message === "Invalid credentials") {
      return res.status(404).json({ message: err.message });
    }
  
    if (err.message === "Unauthorized") {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
  
    // Default error handling
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  };
  