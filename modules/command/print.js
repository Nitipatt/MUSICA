const { MessageEmbed } = require("discord.js");
const { converSecond } = require("../../utility");
const { getColor } = require("../function/level");

function print(message, data, title = "", imageUrl = "") {
  let embed = new MessageEmbed()
    .setImage(imageUrl)
    .setTitle(title)
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setDescription(typeof data === "object" ? JSON.stringify(data) : data);
  message.channel.send(embed);
}

function printError(message, data, title = "", description = "") {
  let embed = new MessageEmbed()
    .setAuthor(
      title,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/delete-sign--v2.png`
    )
    .setTitle(description)
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
  message.channel.send(embed);
}

function printPlaying(message, serverQueue, song) {
  const songInfo = song.songInfo;
  const isAuto = song.isAuto
  const voiceChannel =
    (serverQueue ? serverQueue.voiceChannel : undefined) ||
    message.member.voice.channel;
  const user = song.user;
  let embed = new MessageEmbed()
    .setColor(getColor(message["UserOperate"]("get-level", user.id)))
    .setTitle(songInfo.title)
    .setURL(songInfo.video_url)
    .setAuthor(
      `${isAuto?'Auto':'Now'} Playing`,
      `${isAuto?'https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/auto.png':'https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/71px-YouTube_full-color_icon_%282017%29.svg.png'}`
    )
    .setThumbnail(
      songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
    )
    .addFields(
      { name: "Voice Channel", value: voiceChannel.name, inline: true },
      {
        name: "Song Duration",
        value: songInfo.length_seconds == 0? '🔴Live':converSecond(songInfo.length_seconds),
        inline: true,
      },
      {
        name: "Queue Remaining",
        value: isAuto? '∞': serverQueue.songs.length - 1,
        inline: true,
      }
    )
    .setTimestamp(song.time)
    .setFooter(
      `Requested By: ${user.username}`,
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    );
  message.channel.send(embed);
}

function printSearching(message, serverQueue, text) {
  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setTitle(text)
    .setAuthor(
      `Searching`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/search-flat.png`
    );
  message.channel.send(embed);
}

function printSkip(message, serverQueue) {
  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setAuthor(
      `Skipped`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/497-512.png`
    );
  message.channel.send(embed);
}

function printDuplicate(message, serverQueue) {
  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setAuthor(
      `Duplicate song`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/clone-copy-document-duplicate-file-icon-9.png`
    )
    .setTitle("Check queue using ...queue");
  message.channel.send(embed);
}

function printPausing(message, serverQueue, isResume = false) {
  const songs = serverQueue.songs;
  const song = songs[0];
  const songInfo = song.songInfo;
  const voiceChannel =
    (serverQueue ? serverQueue.voiceChannel : undefined) ||
    message.member.voice.channel;
  const user = song.user;
  if (!isResume) {
    songInfo["pauseAt"] = new Date().getTime();
    songInfo["stop"] = true;
  } else {
    songInfo["stop"] = false;
    const timeEst =
      songInfo["pauseAt"] - serverQueue.connection.dispatcher.startTime;
    serverQueue.connection.dispatcher.startTime =
      new Date().getTime() - timeEst;
  }
  const timeEst = parseInt(
    (new Date().getTime() - serverQueue.connection.dispatcher.startTime) / 1000
  );
  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setTitle(songInfo.title)
    .setURL(songInfo.video_url)
    .setAuthor(
      `${isResume ? "Continue Playing" : "Song Paused"}`,
      `${
        isResume
          ? "https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/71px-YouTube_full-color_icon_%282017%29.svg.png"
          : "https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/190521.png"
      }`
    )
    .setThumbnail(
      songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
    )
    .addFields(
      { name: "Voice Channel", value: voiceChannel.name, inline: true },
      {
        name: "Song Duration",
        value: songInfo.length_seconds == 0? '🔴Live':converSecond(songInfo.length_seconds),
        inline: true,
      },
      {
        name: `${isResume ? "Continue At" : "Paused Time"}`,
        value: converSecond(timeEst),
        inline: true,
      }
    )
    .setTimestamp(song.time)
    .setFooter(
      `Requested By: ${user.username}`,
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    );
  message.channel.send(embed);
}

function printSearchResult(message, list) {
  const number = [
    " #1 ",
    " #2 ",
    " #3 ",
    " #4 ",
    " #5 ",
    " #6 ",
    " #7 ",
    " #8 ",
    " #9 ",
    "#10 ",
  ];
  const resultMessage =
    "```css\n" +
    list
      .map((item, index) => {
        let duration =
          "[" +
          item.duration +
          "]" +
          new Array(9 - (item.duration ? item.duration.length : 0)).join(" ");
        let name = (item.title.length > 40
          ? item.title.substr(0, 40)
          : item.title
        )
          .replace(/@/g, "at ")
          .replace(/\[/g, "(")
          .replace(/\]/g, ")");
        return number[index] + " " + duration + name;
      })
      .join("\n") +
    "\n```";
  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setTitle("Enter number to select")
    .setAuthor(
      `Search Results`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/fd6cb93fd4a235e81e28166a3d59367b.png`
    )
    .setDescription(resultMessage);
  message.channel.send(embed);
}

function printAddToQueue(message, serverQueue, song) {
  const songInfo = song.songInfo;
  const voiceChannel =
    (serverQueue ? serverQueue.voiceChannel : undefined) ||
    message.member.voice.channel;
  const user = song.user;
  const queuePos = serverQueue.songs.findIndex((item) => {
    return item.songInfo.video_url === song.songInfo.video_url;
  });
  let embed = new MessageEmbed()
    .setColor(getColor(message["UserOperate"]("get-level", user.id)))
    .setTitle(songInfo.title)
    .setURL(songInfo.video_url)
    .setAuthor(
      `Queue Added`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/876518.png`
    )
    .setThumbnail(
      songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
    )
    .addFields(
      { name: "Voice Channel", value: voiceChannel.name, inline: true },
      {
        name: "Song Duration",
        value: songInfo.length_seconds == 0? '🔴Live':converSecond(songInfo.length_seconds),
        inline: true,
      },
      {
        name: "EST waiting time",
        value: converSecond(getTimeBeforePlay(serverQueue, queuePos + 1)),
        inline: true,
      },
      {
        name: "Total queue",
        value: serverQueue.songs.length - 1,
        inline: true,
      },
      { name: "Position in queue", value: queuePos, inline: true }
    )
    .setTimestamp(song.time)
    .setFooter(
      `Requested By: ${user.username}`,
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    );
  message.channel.send(embed);
}

function printDeleteFromQueue(message, serverQueue, song) {
  const songInfo = song.songInfo;
  const voiceChannel =
    (serverQueue ? serverQueue.voiceChannel : undefined) ||
    message.member.voice.channel;
  const user = song.user;
  let embed = new MessageEmbed()
    .setColor(getColor(message["UserOperate"]("get-level", user.id)))
    .setTitle(songInfo.title)
    .setURL(songInfo.video_url)
    .setAuthor(
      `Queue Removed`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/delete-sign--v2.png`
    )
    .setThumbnail(
      songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
    )
    .addFields(
      { name: "Voice Channel", value: voiceChannel.name, inline: true },
      {
        name: "Song Duration",
        value: converSecond(songInfo.length_seconds),
        inline: true,
      },
      { name: "Position in queue", value: serverQueue.songs.length }
    )
    .setTimestamp(song.time)
    .setFooter(
      `Requested By: ${user.username}`,
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    );
  message.channel.send(embed);
}

function printEmptyDelete(message) {
  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setAuthor(
      `Cant Remove`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/delete-sign--v2.png`
    )
    .setDescription("There are not you song in queue");
  message.channel.send(embed);
}

function printWaitingQueue(message, serverQueue) {
  const songs = serverQueue.songs;
  const songInfo = songs[0].songInfo;
  const MAX_LIST = 11;
  let listQueue = songs.slice(0, MAX_LIST);

  let data =
    "```css\n" +
    listQueue.reduce((sum, item, index) => {
      let duration =
        "[" +
        converSecond(item.songInfo.length_seconds) +
        "]" +
        new Array(9-converSecond(item.songInfo.length_seconds).length).join(' ')
      let name = (item.songInfo.title > 40
        ? item.songInfo.title.substr(0, 40)
        : item.songInfo.title
      )
        .replace(/@/g, "at ")
        .replace(/\[/g, "(")
        .replace(/\]/g, ")");
      return (
        sum +
        (index == 0
          ? ""
          : duration + name + " " + "  #By_" + item.user.username + "\n")
      );
    }, "") +
    "```\n" +
    (songs.length > MAX_LIST
      ? "And " + (songs.length - MAX_LIST) + " more."
      : "");

  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setTitle(songInfo.title)
    .setURL(songInfo.video_url)
    .setAuthor(
      `Waiting Queue`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/876518.png`
    )
    .setThumbnail(
      songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
    )
    .setDescription(typeof data === "object" ? JSON.stringify(data) : data);
  message.channel.send(embed);
}

function printEmptyQueue(message, data) {
  let embed = new MessageEmbed()
    .setColor(
      getColor(message["UserOperate"]("get-level", message.member.user.id))
    )
    .setAuthor(
      `Waiting Queue`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/876518.png`
    )
    .setDescription(typeof data === "object" ? JSON.stringify(data) : data);
  message.channel.send(embed);
}

function getTimeBeforePlay(serverQueue, length) {
  let timeEst = parseInt(
    (new Date().getTime() - serverQueue.connection.dispatcher.startTime) / 1000
  );
  if (serverQueue.songs[0].songInfo["stop"]) {
    timeEst = parseInt(
      (serverQueue.songs[0].songInfo["pauseAt"] -
        serverQueue.connection.dispatcher.startTime) /
        1000
    );
  }
  const allTimeInQueue = serverQueue.songs
    .slice(0, length)
    .reduce((sum, item, index) => {
      return (
        sum + parseInt(length - 1 == index ? 0 : item.songInfo.length_seconds)
      );
    }, 0);
  return allTimeInQueue - timeEst;
}

function printLevelup(message, song = null) {
  const UserOperate = message["UserOperate"];
  let user = song ? song.user : message.member.user;
  const level = UserOperate("get-level", user.id);
  const maxExpLevel = (level) => parseInt(300 * Math.pow(1.05, level));
  let embed = new MessageEmbed()
    .setColor(getColor(UserOperate("get-level", user.id)))
    .setAuthor(
      `Level ${level}`,
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/LevlUp.png`
    )
    .setTitle(song ? "Congratulations" : "")
    .setThumbnail(
      `https://kingsman-bot.s3.ap-southeast-1.amazonaws.com/${
        Math.ceil(level / 10) - 1 > 15 ? 15 : Math.ceil(level / 10) - 1
      }-removebg-preview.png`
    )
    .addFields({
      name: "EXP",
      value: UserOperate("get-exp", user.id) + "/" + maxExpLevel(level),
    })
    .setTimestamp(new Date().getTime())
    .setFooter(
      user.username,
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    );
  message.channel.send(embed);
}

module.exports = {
  print,
  printPlaying,
  printAddToQueue,
  printWaitingQueue,
  printEmptyQueue,
  printDeleteFromQueue,
  printPausing,
  printSearching,
  printSkip,
  printDuplicate,
  printSearchResult,
  printEmptyDelete,
  printLevelup,
  printError,
};
