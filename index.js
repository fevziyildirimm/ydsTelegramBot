require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const express = require('express');
const fs = require('fs').promises;  // fs.promises kullanılıyor
const path = require('path');
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("running")
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server running");
});

const bot = new TelegramBot(process.env.API_TOKEN, { polling: true });

function getRandomQuestion() {
  const questions = JSON.parse(fs.readFileSync('questions.json'));
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

async function getRandomImage() {
  const imgKlasoru = path.join(__dirname, './questions');

  try {
    const dosyaListesi = await fs.readdir(imgKlasoru);

    if (dosyaListesi.length === 0) {
      console.error('Resim klasöründe dosya bulunamadı.');
      return null;
    }

    const randomIndex = Math.floor(Math.random() * dosyaListesi.length);
    const secilenResim = dosyaListesi[randomIndex];

    return secilenResim;
  } catch (err) {
    console.error('Resim klasörü okunamadı:', err);
    return null;
  }
}

const scheduledMessage = schedule.scheduleJob('0 10-22 * * *', async () => {
  const chatId = process.env.CHAT_ID;
  for (let index = 0; index < 2; index++) {
    const answers = ["A", "B", "C", "D", "E"];
    
    try {
      const secilenResim = await getRandomImage();
      if (secilenResim !== null) {
        const bolumler = secilenResim.split('-');
        const sonBolum = bolumler[bolumler.length - 1];
        const sonKarakter = sonBolum[0];
        console.log(sonKarakter);

        const pollOptions = {
          is_anonymous: false,
          allows_multiple_answers: false,
          correct_option_id: answers.indexOf(sonKarakter),
          type: "quiz"
        };

        console.log(secilenResim);
        await bot.sendPhoto(chatId, `./questions/${secilenResim}`);
        await bot.sendPoll(chatId, bolumler[0]+"/"+bolumler[1], answers, pollOptions);
      } else {
        console.error('Hata: Resim seçilemedi');
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  }
});

async function sendQuestion() {
  const chatId = process.env.CHAT_ID;
  const { question, options, answer } = getRandomQuestion();
  const answers = [getRandomQuestion().options, getRandomQuestion().options];
  const index = (answers.length + 1) * Math.random();
  answers.splice(index | 0, 0, options)

  const pollOptions = {
    is_anonymous: false,
    allows_multiple_answers: false,
    correct_option_id: index,
    type: "quiz"
  };

  await bot.sendPoll(chatId, question, answers, pollOptions);
}

bot.onText(/\/yds/, async (msg) => {
  for (let index = 0; index < 4; index++) {
    const answers = ["A", "B", "C", "D", "E"];
    
    try {
      const secilenResim = await getRandomImage();
      if (secilenResim !== null) {
        const bolumler = secilenResim.split('-');
        const sonBolum = bolumler[bolumler.length - 1];
        const sonKarakter = sonBolum[0];
        console.log(sonKarakter);

        const pollOptions = {
          is_anonymous: false,
          allows_multiple_answers: false,
          correct_option_id: answers.indexOf(sonKarakter),
          type: "quiz"
        };

        console.log(secilenResim);
        await bot.sendPhoto(msg.chat.id, `./questions/${secilenResim}`);
        await bot.sendPoll(msg.chat.id, bolumler[0]+"/"+bolumler[1], answers, pollOptions);
      } else {
        console.error('Hata: Resim seçilemedi');
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  }
});

const scheduledMessageNight = schedule.scheduleJob('1 22 * * *', async () => {
  const chatId = process.env.CHAT_ID;

  bot.sendMessage(chatId, 'Gece modu Başlangıcı 🌕. Bot 10:00 a kadar devre dışı.Çalışmak isteyen arkadaşlar bota  /soru komutunu vererek calısabilirler. İyi geceler... 🖖🏻');

});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
