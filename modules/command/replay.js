const { print } = require("./print");
const { player } = require("./play");

module.exports = function replay(message, serverQueue, QueueOperate) {
  if ((!serverQueue || !serverQueue.connection.dispatcher) && showStatus)
    return print(message, "There're no song currently playing !!!", "System");

  if (serverQueue.connection.dispatcher) {
    try {
      serverQueue.connection.dispatcher.destroy();
      player(message, serverQueue.songs[0], QueueOperate);
    } catch (e) {
      console.log(e);
    }
  }
};
