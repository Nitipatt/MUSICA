const { print } = require("./print");
module.exports = function clear(message, serverQueue, showStatus = true) {
  if (!message.member.voice.channel)
    return print(message, "Please login to some voice channel !!!", "System");
  serverQueue.songs = [];
  if (showStatus) print(message, "Ok, all queue are cleared.", "System");
};
