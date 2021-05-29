var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("sonda connected");
  socket.on("command", function (data) {
    io.emit("exec", { command: data });
  });
  socket.on("log", function (data) {
    console.log(data);
    io.emit("log", data);
  });
});

io.on("disconnect", function (data) {
  console.log("sonda disconnected");
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});
