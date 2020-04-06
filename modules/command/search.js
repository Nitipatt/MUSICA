const { print, printSearching, printSearchResult } = require("./print");

const { validURL, execute } = require("./play");
const ytsr = require("ytsr");

function search(message, serverQueue, QueueOperate) {
  const index = message.content.trim().indexOf(" ");
  const PromptOperate = message.PromptOperate;

  if (index !== -1) {
    const args = message.content.substr(index + 1);
    printSearching(message, serverQueue, args);
    if (validURL(args)) {
      execute(message, serverQueue, QueueOperate);
    } else {
      let filter;
      ytsr.getFilters(args, function (err, filters) {
        if (err) throw err;
        filter = filters.get("Type").find((o) => o.name === "Video");
        var options = {
          limit: 10,
          nextpageRef: filter.ref,
        };
        ytsr(null, options, function (err, searchResults) {
          if (err) return print(message, "Video not found !!!", "System");
          printSearchResult(message, searchResults.items);
          PromptOperate("set", {
            userId: message.member.user.id,
            createAt: new Date().getTime(),
            data: [
              {
                type: "command",
                data: "search",
                carry: searchResults.items,
              },
            ],
          });
        });
      });
    }
  } else {
    return print(message, "See ...help for command !!!", "System");
  }
}

module.exports = search;
