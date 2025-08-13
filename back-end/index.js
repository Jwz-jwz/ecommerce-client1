// import express from "express";
// import categoryRouter from "./routes/categoryRoute.js";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";
// import productRouter from "./routes/productRoute.js";
// import userRouter from "./routes/userRoute.js";
// import orderRouter from "./routes/orderRoute.js";

// const server = express();
// const PORT = 8368;

// dotenv.config();

// server.use(cors());

// server.use(bodyParser.json());

// mongoose.connect(process.env.MONGODB_URL);

// server.use("/api", categoryRouter);
// server.use("/api", productRouter);
// server.use("/api", userRouter);
// server.use("/api", orderRouter);

// server.listen(PORT, () => {
//   console.log(`http://localhost:${PORT} server ajillaj ehellee`);
// });

// //k2AxuOnQh1bpHH9o

import express from "express";
import categoryRouter from "./routes/categoryRoute.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { Server } from "socket.io"; // ✅ Import Socket.IO Server
import http from "http"; // ✅ Native HTTP module

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server from app

const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict later
    methods: ["GET", "POST"],
  },
});
const PORT = 8368;

// ✅ Make io accessible from routes
app.set("io", io);

// ✅ Socket.IO connection
io.on("connection", (socket) => {
  // console.log("🟢 A client connected:", socket.id);

  socket.on("disconnect", () => {
    // console.log("🔴 A client disconnected:", socket.id);
  });
});

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGODB_URL);

// ✅ Routes
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", orderRouter);

// ✅ Start HTTP server (not app.listen)
server.listen(PORT, () => {
  console.log(`✅ Server is running: http://localhost:${PORT}`);
});
