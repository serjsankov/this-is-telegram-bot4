const TelegramApi = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options");

const token = "6196609568:AAEIzZJJOZqYmxA2FfMgCJqehe_vhGQHjtM";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

var notes = [];

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Я загадал число");

  const randomNumber = Math.floor(Math.random() * 10);

  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Info" },
    { command: "/game", description: "Игра угадай цифру" },
    { command: "/напомни", description: "Add task" },
  ]);

  bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
    var text = match[1];
    var time = match[2];
    const chatId = msg.chat.id;

    notes.push({ uid: chatId, time: time, text: text });

    bot.sendMessage(
      chatId,
      "Отлично! Я обязательно напомню, если не сдохну :)"
    );
  });

  //   setInterval(function () {
  //     for (var i = 0; i < notes.length; i++) {
  //       const curDate = new Date().getHours() + ":" + new Date().getMinutes();
  //       if (notes[i]["time"] === curDate) {
  //         bot.sendMessage(
  //           notes[i]["uid"],
  //           "Напоминаю, что вы должны: " + notes[i]["text"] + " сейчас."
  //         );
  //         notes.splice(i, 1);
  //       }
  //     }
  //   }, 1000);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/2.jpg"
      );
      return bot.sendMessage(chatId, "Welcome to bot");
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю");
    console.log(msg);
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифры ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Увы, ты не отгадал цифры ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
