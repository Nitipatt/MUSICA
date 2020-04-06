const { print } = require("./print");

function chatbot(message, serverQueue) {
  const userId = message.member.user.id;
  const UserOperate = message["UserOperate"];
  const PromptOperate = message["PromptOperate"];
  const level = UserOperate("get-level", userId);
  const promptSession = PromptOperate("get");
  const now = new Date().getTime();
  if (
    level >= 50 &&
    (!promptSession || now - promptSession.createAt >= promptTimeout)
  ) {
    print(message, "Listening to word that you provide ...");
    PromptOperate("set", {
      userId: userId,
      createAt: now,
      data: [
        {
          type: "command",
          data: "chatbot",
        },
      ],
    });
  } else {
    print(message, "Required level 50 to get this command.");
  }
}

module.exports = chatbot;
