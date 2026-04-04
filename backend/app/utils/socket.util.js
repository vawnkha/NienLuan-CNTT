let ioInstance = null;

function initSocket(io) {
  ioInstance = io;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io chưa được khởi tạo");
  }
  return ioInstance;
}

function emitAdminNotification(payload) {
  if (!ioInstance) return;
  ioInstance.to("admin-room").emit("admin:notification", payload);
}

module.exports = {
  initSocket,
  getIO,
  emitAdminNotification,
};
