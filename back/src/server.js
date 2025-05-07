import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Startup checks
app.listen(PORT, async () => {
    console.log("Server started on PORT :", PORT);
});

/**
 * GET /api/machines
 * @summary Get all infected machiness
 * @tags Machines
 * @return {array<InfectedMachine>} 200 - Success response - application/json
 * @return {object} 500 - Server error
 */
app.get("/api/health-check", async (req, res) => {
    console.log("Health check");
    res.json("Hello World");
});