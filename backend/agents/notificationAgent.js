const emitEvent = (io, event, payload) => {
  if (!io) return;
  io.emit(event, payload);
  io.emit('notification', { event, ...payload, timestamp: new Date().toISOString() });
};

module.exports = { emitEvent };
