const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", ({ roomId, userId }) => {
    console.log(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("offer", (data) => {
      socket.to(roomId).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(roomId).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(roomId).emit("ice-candidate", data);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Socket server is running");
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

server.listen(3000, () => {
  console.log("Socket server running at http://localhost:3000");
});
