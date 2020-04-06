const { Client } = require("discord.js");
const { prefix, token, promptTimeout } = require("./config/config.json");
// const userList = require("./config/user.json");
const chalk = require("chalk");
const fs = require("fs");

// Modules
const resume = require("./modules/command/resume");
const { print, printLevelup } = require("./modules/command/print");
const pause = require("./modules/command/pause");
const skip = require("./modules/command/skip");
const replay = require("./modules/command/replay");
const leave = require("./modules/command/leave");
const clear = require("./modules/command/clear");
const search = require("./modules/command/search");
const queueList = require("./modules/command/queue");
const handle = require("./modules/function/handle");
const lyric = require("./modules/command/lyric");
const kingman = require("./modules/function/kingman");
const chatbot = require("./modules/command/chatbot");
const deleteSong = require("./modules/command/delete");
const { answer } = require("./modules/function/answer");
const { play, join } = require("./modules/command/play");

const queue = new Map();
let userData = null;
let prompt = null;

const client = new Client();
client.login(token);

const PromptOperate = (key, value) => {
  /*
  userId: Str
  createAt: Datetime
  data: Array
  */
  switch (key) {
    case "get":
      return prompt;
    case "set":
      prompt = value;
      break;
  }
};
const QueueOperate = (operator, key, value = null) => {
  const setQueue = (key, value) => queue.set(key, value);
  const getQueue = (key) => queue.get(key);
  const deleteQueue = (key) => queue.delete(key);
  switch (operator) {
    case "set":
      return setQueue(key, value);
    case "get":
      return getQueue(key);
    case "delete":
      return deleteQueue(key);
  }
};
const UserOperate = (name, value) => {
  switch (name) {
    case "get-all":
      return userData;
    case "get-level":
      return userData && userData[value]
        ? userData[value].level
          ? userData[value].level.id
          : 0
        : 0;
    case "get-exp":
      return userData && userData[value]
        ? userData[value].level
          ? userData[value].level.exp
          : 0
        : 0;
    case "get":
      return userData ? userData[value] : null;
    case "set":
      userData = value ? value : null;
      fs.writeFile(
        "./config/user.json",
        JSON.stringify(userData),
        "utf8",
        () => {}
      );
      return;
    case "set-user":
      userData = { ...userData, ...{ [value.key]: value.value } };
      fs.writeFile(
        "./config/user.json",
        JSON.stringify(userData),
        "utf8",
        () => {}
      );
      return;
  }
};
client.on("ready", () => {
  try{
    userData = JSON.stringify(require("./config/user.json"));
  } catch(e) {}

  client.user.setStatus("available");
  client.user.setActivity(prefix+"help", { type: "LISTENING" });
  console.log(chalk.yellow("Bot Ready."));
});
client.on("message", async (message) => {
  message["UserOperate"] = UserOperate;
  message["PromptOperate"] = PromptOperate;
  message["QueueOperate"] = QueueOperate;
  if (kingman(message)) return;
  if (message.author.bot) return;
  if (message.content.substring(0, prefix.length) == prefix) {
    var args = message.content.trim().substring(prefix.length).split(" ");
    var cmd = args[0] || message.content.trim().substring(prefix.length);
    commandFunction(cmd, message);
  } else {
    const serverQueue = QueueOperate("get", message.guild.id);
    answer(message, serverQueue);
    return;
  }
});

let commandFunction = async (cmd, message) => {
  const serverQueue = QueueOperate("get", message.guild.id);
  const voiceChannel = message.member.voice.channel;

  if (!handle(message, serverQueue, voiceChannel, cmd)) return;

  switch (cmd) {
    case "play":
      play(message, serverQueue, QueueOperate);
      break;
    case "auto":
      play(message, serverQueue, QueueOperate, true);
      break;
    case "replay":
      replay(message, serverQueue, QueueOperate);
      break;
    case "skip":
      skip(message, serverQueue, true, QueueOperate);
      break;
    case "leave":
      leave(message, serverQueue);
      break;
    case "clear":
      clear(message, serverQueue);
      break;
    case "lyric":
      lyric(message, serverQueue);
      break;
    case "delete":
      deleteSong(message, serverQueue);
      break;
    case "search":
      search(message, serverQueue, QueueOperate);
      break;
    case "userinfo":
      printLevelup(message);
      break;
    case "queue":
      queueList(message, serverQueue);
      break;
    case "chatbot":
      chatbot(message, serverQueue);
      break;
    case "join":
      try {
        await join(message, serverQueue, QueueOperate);
      } catch (e) {
        console.log(e);
      }
      break;
    case "forcejoin":
      clear(message, serverQueue, false);
      skip(message, serverQueue, false);
      try {
        await join(message, serverQueue, QueueOperate);
      } catch (e) {
        console.log(e);
      }
      break;
    case "ping":
      print(message, "Pong!");
      break;
    case "resume":
      resume(message, serverQueue);
      break;
    case "pause":
    case "stop":
      pause(message, serverQueue);
      break;
    default:
      print(
        message,
        "Command not found, See ...help for command !!!",
        "System"
      );
      break;
  }
};
