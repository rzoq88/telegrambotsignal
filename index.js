import Binance from "binance-api-node";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// API keys can be generated here https://www.binance.com/en/my/settings/api-management
const binanceClient = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// The bot token can be obtained from BotFather https://core.telegram.org/bots#3-how-do-i-create-a-bot
const bot = new TelegramBot(process.env.TELEGRAMM_BOT_TOKEN, { polling: true });

// Matches "/price [symbol]"
bot.onText(/\/price (.+)/, (msg, data) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Wait...");

  // data[1] can be single token (i.e. "BTC") or pair ("ETH BTC")
  const [cryptoToken1, cryptoToken2 = "USDT"] = data[1].split(" ");

  binanceClient
    .avgPrice({ symbol: `${cryptoToken1}${cryptoToken2}`.toUpperCase() }) // example, { symbol: "BTCUSTD" }
    .then((avgPrice) => {
      bot.sendMessage(chatId, avgPrice["price"]);
    })
    .catch((error) =>
      bot.sendMessage(
        chatId,
        `Error retrieving the price for ${cryptoToken1}${cryptoToken2}: ${error}`
      )
    );
  binanceClient
    .dailyStats({ symbol: `${cryptoToken1}${cryptoToken2}`.toUpperCase() }) // example, { symbol: "BTCUSTD" }
    .then((dailyStats) => {
      bot.sendMessage(
        chatId,
        "price change " +
          dailyStats["priceChange"] +
          "\n" +
          dailyStats["priceChangePercent"] +
          "%"
      );
    })
    .catch((error) =>
      bot.sendMessage(
        chatId,
        `Error retrieving the price for ${cryptoToken1}${cryptoToken2}: ${error}`
      )
    );
});

// const signal = await Promise.all([
//   axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
// ])

// const result = signal.data.price_change_percentage_24h;
// console.log(result);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  async function get() {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    const data = await response.json();
    console.log(data[0].current_price);
    
    
    let i = 0;
    do {
      task(i);
      i++;
    } while (i < 100);
    function task(i) {
      setTimeout(function () {
        if (data[i].price_change_percentage_24h < -7) {
          const price = data[i].current_price.toFixed(4);
          const BuyPrice = price * 0.98;
          const stopLoss = BuyPrice * 0.95;
  
          bot.sendMessage(
            chatId,
            `
          long ${data[i].symbol}USDT \n 
          on ${BuyPrice} \n
          sell on: \n
          target 1 : ${(BuyPrice * 1.02).toFixed(5)} \n
          target 2 : ${(BuyPrice * 1.04).toFixed(5)} \n
          target 3 : ${(BuyPrice * 1.05).toFixed(5)} \n
          target 4 : ${(BuyPrice * 1.06).toFixed(5)} \n
          StopLoss : ${stopLoss.toFixed(5)}
          
          `
          );
        } else if (data[i].price_change_percentage_24h > 15) {
          const price = data[i].current_price.toFixed(4);
          const BuyPrice = price * 1.02;
          const stopLoss = BuyPrice * 1.05;
  
          bot.sendMessage(
            chatId,
            `
          short ${data[i].symbol}USDT \n 
          on ${BuyPrice} \n
          profit on: \n
          target 1 : ${(BuyPrice * 0.98).toFixed(5)} \n
          target 2 : ${(BuyPrice * 0.96).toFixed(5)} \n
          target 3 : ${(BuyPrice * 0.94).toFixed(5)} \n
          target 4 : ${(BuyPrice * 0.92).toFixed(5)} \n
          StopLoss : ${stopLoss.toFixed(5)}
          
          `
          );
        }
      }, 5000 * i);
    }

    for (let i = 0; i < 100; i++) {
      
    }
  }

  function signal() {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data[0].current_price);
        let output = [];

        for (let i = 0; i < 100; i++) {
          if (data[i].price_change_percentage_24h < -7) {
            const price = data[i].current_price.toFixed(4);
            const BuyPrice = price * 0.98;
            const stopLoss = BuyPrice * 0.95;

            console.log(data[i].name);
            console.log(data[i].current_price);
            bot.sendMessage(
              chatId,
              `
              long ${data[i].symbol}USDT \n 
              on ${BuyPrice} \n
              sell on: \n
              target 1 : ${(BuyPrice * 1.02).toFixed(5)} \n
              target 2 : ${(BuyPrice * 1.04).toFixed(5)} \n
              target 3 : ${(BuyPrice * 1.05).toFixed(5)} \n
              target 4 : ${(BuyPrice * 1.06).toFixed(5)} \n
              StopLoss : ${stopLoss.toFixed(5)}
              
              `
            );
          } else if (data[i].price_change_percentage_24h > 10) {
            const price = data[i].current_price.toFixed(4);
            const BuyPrice = price * 1.02;
            const stopLoss = BuyPrice * 1.05;

            console.log(data[i].name);
            console.log(data[i].current_price);
            bot.sendMessage(
              chatId,
              `
              short ${data[i].symbol}USDT \n 
              on ${BuyPrice} \n
              profit on: \n
              target 1 : ${(BuyPrice * 0.98).toFixed(5)} \n
              target 2 : ${(BuyPrice * 0.96).toFixed(5)} \n
              target 3 : ${(BuyPrice * 0.94).toFixed(5)} \n
              target 4 : ${(BuyPrice * 0.92).toFixed(5)} \n
              StopLoss : ${stopLoss.toFixed(5)}
              
              `
            );
          }
        }
      });
  }
  async function topten() {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    const data = await response.json();

    for (let i = 0; i < 10; i++) {
      bot.sendMessage(
        chatId,
        `${data[i].market_cap_rank} ${data[i].name} ${data[i].symbol}\n ${data[i].current_price} \n  `
      );
    }
  }

  switch (msg.text) {
    case "/start":
      get();
      
      
      break;

    case "/signal":
      // setInterval(signal, 10000);
      get();

      break;
    case "/top10":
      topten();
      break;
    case "/test":
      get();
      break;
    case "/signal":
      break;

    default:
      break;
  }
});
