import express from "express";
import expressProxy from "express-http-proxy";
import { authUser } from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

export const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", // frontend URL
        credentials: true, // allow cookies
    })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", expressProxy("http://localhost:4001"));
// app.use("/api/v1/user", expressProxy("http://localhost:4002"));
// app.use("/api/v1/chat", expressProxy('http://localhost:4002'))
app.use(
    "/api/v1/chat",
    createProxyMiddleware({
        target: "http://localhost:4002",
        changeOrigin: true,
        selfHandleResponse: false, // <- Important for SSE
        pathRewrite: {
            "^/api/v1/chat": "",
        },
        onProxyReq: (proxyReq, req, res) => {
            if (req.headers.cookie) {
                proxyReq.setHeader("cookie", req.headers.cookie);
            }
        },
    })
);

export default app;
