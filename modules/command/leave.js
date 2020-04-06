const { print } = require("./print");

module.exports = function leave(message, serverQueue) {
  print(message, "Ok, See you.", "System");
  if (serverQueue) {
    serverQueue.songs = [];
    serverQueue.voiceChannel = {};
    serverQueue.connection.disconnect();
    serverQueue.connection.dispatcher
      ? serverQueue.connection.dispatcher.destroy()
      : () => {};
  }
};
