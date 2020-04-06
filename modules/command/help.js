const { print } = require("./print");
const { prefix } = require("../../config/config.json");
module.exports = function help(message, serverQueue) {
  return print(
    message,
    `
        ${prefix}play [youtube_url or music_name]
        ${prefix}auto [youtube_url or music_name]
        ${prefix}search [music_name]
        ${prefix}delete
        ${prefix}join
        ${prefix}forcejoin
        ${prefix}pause
        ${prefix}resume
        ${prefix}queue
        ${prefix}skip
        ${prefix}replay
        ${prefix}clear
        ${prefix}leave
        ${prefix}ping
        ${prefix}lyric
        ${prefix}userinfo
        `,
    "Here is available command."
  );
};
