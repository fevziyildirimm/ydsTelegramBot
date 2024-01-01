require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const express=require('express')
const fs = require('fs');
const app=express();
app.use(express.json());
app.get("/",(req,res)=>{
  res.send("running")
})
app.listen(process.env.PORT||3000,()=>{
  console.log("server running");
})
const bot = new TelegramBot(process.env.API_TOKEN, { polling: true });

function getRandomQuestion() {
  const questions = JSON.parse(fs.readFileSync('questions.json'));
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}
const scheduledMessage = schedule.scheduleJob('*/30 * * * *', async() => { //schedule her yarım saatte bir çalışacak sekilde ayarlandı.
  for (let index = 0; index < 10; index++) {
    await sleep(1500);
    sendQuestion();
  }
});

  function  sendQuestion() {
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

  bot.sendPoll(chatId, question, answers, pollOptions);
}


bot.onText(/\/soru/, async (msg) => {
  for (let index = 0; index < 10; index++) {
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
    await sleep(1500);


    bot.sendPoll(msg.chat.id, question, answers, pollOptions);
  }
  
});
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}