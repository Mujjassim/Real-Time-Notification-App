import app from "./app.js";
import { initializeSocket } from "./services/socketService.js";

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);

initializeSocket(server);
