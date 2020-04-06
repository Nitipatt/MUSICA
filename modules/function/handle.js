const { checkObj } = require("../../utility");
const { print } = require("../command/print");
const help = require("../command/help");

function handle(message, serverQueue, voiceChannel, cmd) {
  if (!serverQueue && !["join", "play", "help"].includes(cmd)) {
    return false;
  }
  if (cmd.trim() === "help") {
    help(message, serverQueue);
    return false;
  }
  if (
    serverQueue &&
    voiceChannel &&
    voiceChannel.id !== serverQueue.voiceChannel.id &&
    checkObj(serverQueue.voiceChannel) &&
    !["forcejoin", "help"].includes(cmd)
  ) {
    print(
      message,
      "MUSICA is now playing in " + serverQueue.voiceChannel.name + " !!!",
      "System"
    );
    return false;
  }
  if (
    serverQueue &&
    voiceChannel &&
    voiceChannel.id === serverQueue.voiceChannel.id &&
    ["forcejoin", "join"].includes(cmd)
  ) {
    print(message, "Hi I'am here for you !!!", "System");
    return false;
  }
  if (!voiceChannel) {
    print(message, "Please login to some voice channel !!!", "System");
    return false;
  }
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    print(message, "Give me permissions please !!!", "System");
    return false;
  }
  return true;
}
module.exports = handle;
