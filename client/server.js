import express from "express";
import {createProxyMiddleware} from "http-proxy-middleware";

const app = express();

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    ws: true,
  })
);

app.listen(8080, () => {
  console.log("Proxy server running on port 8080");
});
