const WebSocket = require("ws");

const port = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port });

const users = {};

wss.on("connection", (ws) => {
  let currentUser = null;

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "register") {
      users[data.userId] = ws;
      currentUser = data.userId;
    }

    if (["offer", "answer", "candidate"].includes(data.type)) {
      const target = users[data.to];
      if (target) target.send(JSON.stringify(data));
    }
  });

  ws.on("close", () => {
    if (currentUser) delete users[currentUser];
  });
});

console.log("🚀 Server running");