const { print, printSkip,printLevelup } = require("./print");
const { player } = require("./play");
const { getReward } = require("../function/level");

module.exports = function skip(
  message,
  serverQueue,
  showStatus = true,
  QueueOperate
) {
  if ((!serverQueue || !serverQueue.connection.dispatcher) && showStatus)
    return print(message, "There is no song that I could skip !!!", "System");

  if (serverQueue.connection.dispatcher) {
    try {
      if (showStatus) printSkip(message, serverQueue);

      getReward(message, serverQueue.songs[0], serverQueue, (isLevelup)=> {
        if(isLevelup)printLevelup(message, serverQueue.songs[0]);
      });

      serverQueue.connection.dispatcher.destroy();
      serverQueue.songs.shift();
      player(message, serverQueue.songs[0], QueueOperate);
    } catch (e) {
      console.log(e);
    }
  }
};
