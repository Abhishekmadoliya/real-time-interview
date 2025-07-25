const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dontenv = require('dotenv');
dontenv.config();

const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

const connecttoDB = async ()=>{
  try {
    
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to db succusfully");
    
  } catch (error) {
    console.log("error in db connection ", error);
    
    
  }
}

connecttoDB();


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



const authRoutes = require("./routes/auth");
const { default: connectToDB } = require("./db/connecttodb");
app.use("/auth", authRoutes);
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

server.listen(3000, () => {
  console.log("Socket server running at http://localhost:3000");
});
