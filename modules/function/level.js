function getColor(level) {
  if (level == 0) return "#000";

  if (level <= 10) return "#b3816a";
  if (level <= 20) return "#b36946";
  if (level <= 30) return "#b55021";
  if (level <= 40) return "#b73a00";

  if (level <= 50) return "#a7a7a7";
  if (level <= 60) return "#8b8b8b";
  if (level <= 70) return "#565656";

  if (level <= 80) return "#ceb458";
  if (level <= 90) return "#caa72b";
  if (level <= 100) return "#d0a200";

  if (level <= 110) return "#489fb7";
  if (level <= 120) return "#1e98b9";
  if (level <= 130) return "#0394bb";

  if (level <= 140) return "#3666ab";
  if (level <= 150) return "#1a57af";
  if (level <= 160) return "#0045a9";
  if (level > 160) return "#0000ff";
  return "#000";
}

function getReward(message, song, serverQueue = null, callback=()=>{}) {
  const UserOperate = message["UserOperate"];
  if (song) {
    let expGain = 0;
    if (serverQueue) {
      expGain = parseInt(
        (new Date().getTime() - serverQueue.connection.dispatcher.startTime) /
          1000
      );
    } else {
      expGain = parseInt(song.songInfo.length_seconds);
    }
    const userId = song.user.id;
    let level = UserOperate("get-level", userId);
    let exp = UserOperate("get-exp", userId);
    const maxExpLevel = level => parseInt(300 * Math.pow(1.05, level));
    let isLevelup = false
    while (true) {
      const maxExp = maxExpLevel(level);
      if (exp + expGain >= maxExp) {
        expGain = exp + expGain - maxExp;
        exp = 0;
        UserOperate("set-user", {
          key: userId,
          value: {
            level: {
              id: ++level,
              exp: 0
            }
          }
        });
        isLevelup = true
      } else if (expGain == 0) {
        UserOperate("set-user", {
          key: userId,
          value: {
            level: {
              id: level,
              exp: exp
            }
          }
        });
        callback(isLevelup)
        break;
      } else {
        exp += expGain;
        expGain = 0;
      }
    }
  }
}

module.exports = { getColor, getReward };
