const {
  print,
  printPlaying,
  printAddToQueue,
  printPausing,
  printEmptyQueue,
  printSearching,
  printDuplicate,
  printLevelup,
  printError
} = require("./print");
const { getReward } = require("../function/level");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");

async function join(message, serverQueue, QueueOperate) {
  const voiceChannel =
    (serverQueue ? serverQueue.voiceChannel : undefined) ||
    message.member.voice.channel;
  if (!voiceChannel)
    return print(message, "Please login to some voice channel !!!", "System");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return print(message, "Give me permissions please !!!", "System");
  }

  const queueContruct = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  };
  QueueOperate("set", message.guild.id, queueContruct);
  try {
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
  } catch (err) {
    console.log(err);
  }
  print(
    message,
    "Hi I'm MUSICA, And I'm ready for you guys in  " +
      voiceChannel.name +
      " !!!",
    "System"
  );
}
function player(message, song, QueueOperate) {
  const guild = message.guild;
  const serverQueue = QueueOperate("get", guild.id);
  if (!song) {
    return;
  }
  const dispatcher = serverQueue.connection
    .play(ytdl(song.songInfo.video_url), {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    })
    .on("finish", () => {
      // User reward
      getReward(message, serverQueue.songs[0], null, (isLevelup) => {
        if (isLevelup) printLevelup(message, serverQueue.songs[0]);
      });

      if (serverQueue.songs[0].isAuto) {
        message["content"] =
          "...auto " + song.songInfo.related_videos[0].title;
        serverQueue.songs.shift();
        play(message, serverQueue, QueueOperate, (auto = true));
      } else {
        serverQueue.songs.shift();
        if (serverQueue.songs.length) {
          player(message, serverQueue.songs[0], QueueOperate);
        } else {
          printEmptyQueue(message, "Queue ended, Please add more song.");
        }
      }
    })
    .on("error", (error) => {
      play(message, serverQueue, QueueOperate, auto);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  printPlaying(message, serverQueue, song);
}

async function execute(message, serverQueue, QueueOperate, url = null, auto) {
  const args = (url && url.split(" ")) || message.content.split(" ");
  const voiceChannel =
    (serverQueue ? serverQueue.voiceChannel : undefined) ||
    message.member.voice.channel;
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return print(message, "Give me permissions please !!!", "System");
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    songInfo: songInfo,
    user: message.member.user,
    time: new Date().getTime(),
    isAuto: !!auto,
  };
  let startPlayer = async () => {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };
    QueueOperate("set", message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      player(message, queueContruct.songs[0], QueueOperate);
    } catch (err) {
      console.log(err);
      QueueOperate("delete", message.guild.id);
      return print(message, err);
    }
  };

  if (!serverQueue || (serverQueue && !serverQueue.songs)) {
    return startPlayer();
  } else {
    if (!serverQueue.connection.dispatcher) {
      return startPlayer();
    }
    if (checkDuplicate(message, serverQueue, song)) {
      return printDuplicate(message, serverQueue);
    } else {
      pushSongPriority(message, serverQueue, song);
      return printAddToQueue(message, serverQueue, song);
    }
  }
}

function checkDuplicate(message, serverQueue, song) {
  return (
    serverQueue.songs.findIndex((item) => {
      return item.songInfo.video_url === song.songInfo.video_url;
    }) !== -1
  );
}

function pushSongPriority(message, serverQueue, song) {
  // let insertIndex = serverQueue.songs.length;
  // const userLevel = message["UserOperate"]("get-level", message.member.user.id);
  // for (let i = serverQueue.songs.length - 1; i > 0; i--) {
  //   const currentSong = serverQueue.songs[i];
  //   const currentSongUserLevel = message["UserOperate"](
  //     "get-level",
  //     currentSong.user.id
  //   );
  //   if (userLevel > currentSongUserLevel) {
  //     insertIndex = i;
  //   } else {
  //     break;
  //   }
  // }
  // serverQueue.songs.splice(insertIndex, 0, song);
  serverQueue.songs.push(song);
}

async function play(message, serverQueue, QueueOperate, auto = false) {
  const index = message.content.trim().indexOf(" ");
  if (index !== -1) {

    if(serverQueue && serverQueue.songs && serverQueue.songs[0] && serverQueue.songs[0].isAuto){
      printError(message, serverQueue, `Cant Add Song`,`Current song is playing in auto mode`)
      return;
    }

    const args = message.content.substr(index + 1);
    printSearching(message, serverQueue, args);
    if (validURL(args)) {
      execute(message, serverQueue, QueueOperate, null, auto);
    } else {
      let filter;
      ytsr.getFilters(args, function (err, filters) {
        if (err) throw err;
        filter = filters.get("Type").find((o) => o.name === "Video");
        var options = {
          limit: 1,
          nextpageRef: filter.ref,
        };
        ytsr(null, options, function (err, searchResults) {
          if (err) return print(message, "Video not found !!!", "System");
          execute(
            message,
            serverQueue,
            QueueOperate,
            "...play " + searchResults.items[0].link,
            auto
          );
        });
      });
    }
  } else {
    if (!serverQueue)
      return print(
        message,
        "There're no song in list, See ...help for command !!!",
        "System"
      );
    const player = serverQueue.connection.dispatcher;
    if (!player)
      return print(message, "There're no song currently playing !!!", "System");
    if (!serverQueue.songs[0].songInfo["pauseAt"]) {
      if(auto)serverQueue.songs[0].isAuto = true
      printPlaying(message, serverQueue, serverQueue.songs[0]);
    } else {
      player.resume();
      return printPausing(message, serverQueue, true);
    }
  }
}

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
module.exports = { play, join, player, validURL, execute };
