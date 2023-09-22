(() => {
  let socket, reconnectionTimerId;
  const requestUrl = `${window.location.origin.replace("http", "ws")}/refresh`;
  function log(message) {
    console.info("[refresh] ", message);
  }
  function refresh() {
    window.location.reload();
  }
  function connect(callback) {
    if (socket) {
      socket.close();
    }
    socket = new WebSocket(requestUrl);
    socket.addEventListener("open", callback);
    socket.addEventListener("message", (event) => {
      if (event.data === "refresh") {
        log("refreshing...");
        refresh();
      }
    });
    socket.addEventListener("close", () => {
      log("connection lost - reconnecting...");
      clearTimeout(reconnectionTimerId);
      reconnectionTimerId = setTimeout(() => {
        connect(refresh);
      }, 1000);
    });
  }
  connect();
})();
