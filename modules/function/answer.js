const { print } = require("../command/print");
const { promptTimeout } = require("../../config/config.json");
const { execute } = require("../command/play");

function answer(message, serverQueue) {
  const TIMEOUT = promptTimeout;

  const userId = message.member.user.id;
  const now = new Date().getTime();
  const userMessage = message.content;
  const PromptOperate = message.PromptOperate;
  const QueueOperate = message.QueueOperate;
  const promptSession = PromptOperate("get");
  let PromptData = promptSession ? promptSession.data : null;

  if (!promptSession) return;
  else if (
    promptSession.userId === userId &&
    now - promptSession.createAt < TIMEOUT
  ) {
    PromptData.push({
      type: "response",
      data: userMessage,
    });

    const cmd = promptSession.data[0].data;
    const carryData = promptSession.data[0].carry
      ? promptSession.data[0].carry
      : null;

    switch (cmd) {
      case "chatbot":
        break;
      case "search":
        if (
          !isNaN(userMessage) &&
          parseInt(userMessage) > 0 &&
          parseInt(userMessage) <= 10
        ) {
          execute(
            message,
            serverQueue,
            QueueOperate,
            "...play " + carryData[parseInt(userMessage) - 1].link
          );
          PromptOperate("set", null);
        }
        break;
    }
  } else if (now - promptSession.createAt >= TIMEOUT) {
    PromptOperate("set", null);
  }
}
module.exports = { answer };
