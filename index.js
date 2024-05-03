const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./src/config/dbConfig.js");
// routes import
const userRoutes = require("./src/routes/v1/userRoutes.js");
const contactRoutes = require("./src/routes/v1/contactRoutes.js");

const app = express();
const http = require("http").createServer(app);
app.use(cors());
app.use(express.json());

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-chat", (users) => {
    const room = generateRoomName(users);
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("send-message", (data) => {
    const { room, message, sender } = data;
    io.to(room).emit("receive-message", { message, sender });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

function generateRoomName(users) {
  return users.sort().join("-");
}

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/contacts", contactRoutes);

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log("listening on *:5000");
});
