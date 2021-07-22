require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const axios = require("axios");
const cron = require("node-cron");
const repository = require("./repository.js");
const storage = require("node-persist");
const apiService = require("./api.service.js");

storage
  .init({
    dir: "./storage",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
    logging: false,
    ttl: false,
    forgiveParseErrors: false,
  })
  .then(async () => {
    console.log("Storage ready");
    await repository.loadData();
    await apiService.uploadProbes(repository.getData());
    repository.clearData();
  });
cron.schedule("* * * * *", async () => {
  try {
    repository.saveData();
  } catch (e) {}
});
cron.schedule("* * * * *", async () => {
  try {
    await apiService.uploadProbes(repository.getData());
    repository.clearData();
  } catch (e) {}
});

setInterval(() => {
  repository.registerProbe("test", {
    value: 33,
    type: "TEMPERATURE",
    captured_at: new Date(),
  });
  repository.registerProbe("test", {
    value: 50,
    type: "HUMIDITY",
    captured_at: new Date(),
  });
}, 2000);
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("device connected");
  socket.on("command", function (command) {
    io.emit("exec", { command });
  });
  socket.on("log", function (data) {
    console.log(data);
    io.emit("log", data);
  });
});

io.on("disconnect", function (data) {
  console.log("device disconnected");
});

http.listen(process.env.APP_PORT || 3000, function () {
  console.log("listening on *:3000");
});
