import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { CORS_ORIGIN } from "./variables";
import path from "path";
import os from "os";
import http from "http";
import rootRouter from "./routes";
import { NotFoundException } from "./exceptions/not-found";
import { ErrorCode } from "./exceptions/root";
import { errorMiddleware } from "./middlewares/errorsMiddleware";

// import { getUserRecommendations } from "./controllers/recommendattions";

const serverIP = Object.values(os.networkInterfaces())
  .flat()
  .filter((info) => info.family === "IPv4" && !info.internal)
  .map((info) => info.address)[0];

console.log("Server IP address:", serverIP);
//EXPRESS SERVER SETUP

const app: Express = express();

// SET THE APPLICATION TO TRUST THE REVERSE PROXY
app.set("trust proxy", true);

// const server = http.createServer(app);

// MIDDLEWARES
// app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
// Allow requests from any origin
app.use(cors());
//allow multipart form data
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb" }));
app.use("/public", express.static(path.join(__dirname, "../public")));

// ROUTES
app.use("/api", rootRouter);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundException(
    `Route ${req.originalUrl} not found`,
    ErrorCode.ROUTE_NOT_FOUND
  ) as any;
});

// ERROR HANDLERS
app.use(errorMiddleware);

export default app;
