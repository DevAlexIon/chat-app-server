const io = require("socket.io-client");
const socket = io("http://localhost:5001");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("newMessage", (message) => {
  console.log("New message received:", message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
