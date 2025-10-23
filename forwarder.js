import https from "https";
import fs from "fs";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.get("/health", (req, res) => {
  res.send("We're alive! 🚀");
});

app.use("/webhook/test/:id", express.json());

app.post("/webhook/test/:id", (req, res) => {
  const webhookData = req.body;
  console.log(
    JSON.stringify(
      {
        headers: req.headers,
        params: {
          webhookId: req.params.id,
        },
        body: webhookData,
      },
      null,
      2
    )
  );
  res.send(
    "Webhook received successfully! Open pm2 logs to see the webhook data"
  );
});

// Proxy to your local server (e.g., port 4040)
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:4040",
    changeOrigin: true,
  })
);

// SSL certs for local HTTPS
const options = {
  key: fs.readFileSync("./x1502za.alpines-insen.ts.net+3-key.pem"),
  cert: fs.readFileSync("./x1502za.alpines-insen.ts.net+3.pem"),
};

// HTTPS server
https.createServer(options, app).listen(4433, "0.0.0.0", () => {
  console.log("HTTPS forwarder running on https://0.0.0.0:4433");
});
