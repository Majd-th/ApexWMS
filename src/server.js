// Import the Express app from app.js
import app from "./app.js";

// Import dotenv to load environment variables (like PORT)
import dotenv from "dotenv";
dotenv.config(); // Ensures that .env variables are available in this file

// Define the server port (use .env if available, otherwise default to 3000)
const PORT = process.env.PORT || 3000;

// Start the server and make it listen on the defined port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`); // Debug log to confirm that the server started successfully
});

/*
🪲 Debugging usage:
The console.log line was critical for confirming that the backend successfully started on the correct port.
If the terminal didn’t show “Server running on port 3000”, it meant the server failed to start.
This allowed quick debugging of environment setup or syntax errors.
*/
