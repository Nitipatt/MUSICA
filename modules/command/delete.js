const {
  printDeleteFromQueue,
  printEmptyQueue,
  printEmptyDelete,
} = require("./print");

module.exports = function deleteSong(message, serverQueue) {
  if (serverQueue && serverQueue.songs.length > 1) {
    for (let i = serverQueue.songs.length - 1; i > 0; i--) {
      const currentSong = serverQueue.songs[i];
      if (currentSong.user.id === message.member.user.id) {
        let song = serverQueue.songs.splice(i, 1);
        return printDeleteFromQueue(message, serverQueue, song);
      }
    }
    printEmptyDelete(message);
  } else {
    printEmptyQueue(message, "Queue is empty !!!");
  }
};
