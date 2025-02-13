import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

// .env 파일 로드
dotenv.config();


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.PROD_CLIENT_URL, process.env.PROD_BRANCH_CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let connectedUsers = 0;

io.on("connection", (socket) => {
  console.log("사용자가 연결되었습니다");

  const isLeftBoard = connectedUsers % 2 === 0;
  socket.emit("assignBoard", isLeftBoard ? "left" : "right");
  connectedUsers++;

  socket.on("updateLeftBoard", (elements) => {
    console.log("Left board update received");
    io.emit("updateLeftBoard", elements);
  });

  socket.on("updateRightBoard", (elements) => {
    console.log("Right board update received");
    io.emit("updateRightBoard", elements);
  });

  socket.on("disconnect", () => {
    console.log("사용자가 연결을 해제했습니다");
    connectedUsers--;
  });
});

httpServer.listen(3001, () => {
  console.log("서버가 3001 포트에서 실행 중입니다");
});
