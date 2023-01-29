// region i18n
const i18n = document.querySelectorAll("[data-intl]");
const i18nTitle = document.querySelectorAll("[data-intl-title]");
i18n.forEach((msg) => {
  msg.innerHTML = chrome.i18n.getMessage(msg.dataset.intl || msg.id);
});
i18nTitle.forEach((msg) => {
  msg.title = chrome.i18n.getMessage(msg.getAttribute("data-intl-title"));
});
// endregion

// Set language
chrome.i18n.getAcceptLanguages((languages) => {
  document.documentElement.lang = languages[0];
});

const numbers = "0123456789";
const letters = "abcdefghijklmnopqrstuvwxyz";
const symbols = "!@#$%^&*()";
const extendedSymbol = `~${symbols}-_=+[]{};:,.<>/?`;

const pwdGenerator = () => {
  const pwdLength = document.getElementById("pwdLength").value;
  const pwdWithSymbols = document.getElementById("pwdWithSymbols").checked;
  const chars = `${numbers}${letters}${pwdWithSymbols ? symbols : ""}${letters.toUpperCase()}`;
  let password = "";
  if (crypto.getRandomValues) {
    const array = new Uint32Array(chars.length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < pwdLength; i++) {
      password += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < pwdLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  document.getElementById("pwdLengthTxt").innerText = pwdLength;
  document.getElementById("password").innerText = password;
  rangeMouseOut();
};

const rangeMouseOut = () => {
  const rangeElement = document.getElementById("pwdLength");
  const percentage = ((rangeElement.value - rangeElement.min) / (rangeElement.max - rangeElement.min)) * 100;
  rangeElement.style = "background: linear-gradient(to right, #90b9f0, #90b9f0 " + percentage + "%, #ffffff " + percentage + "%, #ffffff 100%)";
};

const rangeMouseOver = () => {
  const rangeElement = document.getElementById("pwdLength");
  const percentage = ((rangeElement.value - rangeElement.min) / (rangeElement.max - rangeElement.min)) * 100;
  rangeElement.style = "background: linear-gradient(to right, #90b9f0, #90b9f0 " + percentage + "%, #f8fafe " + percentage + "%, #f8fafe 100%)";
};

const pwdCopyHandler = () => {
  navigator.clipboard.writeText(document.getElementById("password").value);
};

document.getElementById("pwdLength").addEventListener("input", rangeMouseOver);
document.getElementById("pwdLength").addEventListener("mouseover", rangeMouseOver);
document.getElementById("pwdLength").addEventListener("mouseout", rangeMouseOut);
document.getElementById("pwdLength").addEventListener("change", pwdGenerator);
document.getElementById("pwdWithSymbols").addEventListener("change", pwdGenerator);
document.getElementById("refresh").addEventListener("click", pwdGenerator);
document.getElementById("copy").addEventListener("click", pwdCopyHandler);
window.addEventListener("load", pwdGenerator);
