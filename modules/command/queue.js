const { printWaitingQueue, printEmptyQueue } = require("./print");
const { converSecond } = require("../../utility");

module.exports = function queueList(message, serverQueue) {
  if (serverQueue && serverQueue.songs && serverQueue.songs.length > 1) {
    printWaitingQueue(
      message,
      serverQueue
    );
  } else if (serverQueue && serverQueue.songs.length === 0) {
    printEmptyQueue(message, "Queue is empty !!!");
  } else if (serverQueue && serverQueue.songs.length !== 0 && serverQueue.songs[0].isAuto) {
    printEmptyQueue(message, "Queue not support in auto mode !!!");
  } else {
    printEmptyQueue(message, "Queue is empty !!!");
  }
};
