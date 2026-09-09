import express from "express";

const app = express();
const port = Number(process.env.PORT || 4000);

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "eventbridge-api" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`EventBridge API running at http://localhost:${port}`);
});
