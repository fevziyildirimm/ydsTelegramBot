require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const bot = new TelegramBot(process.env.API_TOKEN, { polling: true });

function getRandomQuestion() {
  const questions = JSON.parse(fs.readFileSync('questions.json'));
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

function sendQuestion() {
  const chatId = process.env.CHAT_ID;
  const { question, options, answer } = getRandomQuestion();
   const answers=[getRandomQuestion().options,getRandomQuestion().options];
   const index=(answers.length+1) * Math.random();
   answers.splice(index | 0, 0, options)

   

const pollOptions = {
    is_anonymous: false, 
    allows_multiple_answers: false, 
    correct_option_id: index,
    type:"quiz"
  };
  
  
  bot.sendPoll(chatId, question,answers,pollOptions);
}

setInterval(sendQuestion, 18000000); 