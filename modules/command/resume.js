const { print, printPausing } = require("./print");

module.exports = function resume(message, serverQueue) {
  if (!message.member.voice.channel)
    return print(message, "Please login to some voice channel !!!", "System");

  const player = serverQueue.connection.dispatcher;
  if (!player) return print(message, "There's no song pausing !!!", "System");

  player.resume();
  return printPausing(message, serverQueue, true);
};
