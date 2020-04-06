const { print } = require("./print");
const solenolyrics = require("solenolyrics");

async function lyric(message, serverQueue) {
  if (serverQueue && serverQueue.songs && serverQueue.songs[0]) {
    try {
      var lyrics = await solenolyrics.requestLyricsFor(
        serverQueue.songs[0].title
      );
      if (lyrics) print(message, lyrics, serverQueue.songs[0].title);
      else print(message, "Lyric not found !!!", serverQueue.songs[0].title);
    } catch (e) {
      console.log(e);
      print(message, "Lyric not found !!!", serverQueue.songs[0].title);
    }
  } else {
    return print(message, "There're no song currently playing !!!", "System");
  }
}

module.exports = lyric;
