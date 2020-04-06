const { print, printPausing } = require("./print");

module.exports = function pause(message, serverQueue) {
  if (!message.member.voice.channel)
    return print(message, "Please login to some voice channel !!!", "System");

  const player = serverQueue.connection.dispatcher;
  if (!player)
    return print(message, "There're no song currently playing !!!", "System");

  player.pause();
  return printPausing(message, serverQueue);
};
