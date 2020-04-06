const { print } = require("../command/print");

function kingman(message) {
  if (
    message.content.includes("<@!693029804370558986>") ||
    message.content.includes("<@&690961245846765618>") ||
    message.content.includes("<@&693443789666254918>")
  ) {
    print(
      message,
      `<@&690961245846765618> come here plese <@!${message.author.id}> wanna talk with you.`
    );
    return true;
  }
  return false;
}

module.exports = kingman;
