function checkObj(obj) {
  return !(Object.keys(obj).length === 0 && obj.constructor === Object);
}

function converSecond(sec) {
  let hr =
    parseInt(sec / 3600) == 0
      ? ""
      : sec / 3600 < 10
      ? `0${parseInt(sec / 3600)}:`
      : `${parseInt(sec / 3600)}:`;
  sec %= 3600;
  let min = parseInt(sec / 60 == 0)
    ? ""
    : sec / 60 < 10
    ? `0${parseInt(sec / 60)}:`
    : `${parseInt(sec / 60)}:`;
  sec %= 60;
  sec = sec < 10 ? `0${sec}` : sec;
  return hr + min + sec;
}

module.exports = { checkObj, converSecond };
