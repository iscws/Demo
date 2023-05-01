const axios = require("axios");
const tunnel = require("tunnel");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;
// 代理设置
const agent = tunnel.httpsOverHttp({
  proxy: {
    host: "127.0.0.1",
    port: 7890,
  },
});
const client = axios.create({
  headers: {
    Authorization: "Bearer " + apiKey,
  },
  httpsAgent: agent,
  proxy: false,
});

// 发送内容
const params = {
  prompt: "How are you?",
  model: "text-davinci-003",
  max_tokens: 10,
  temperature: 0,
};

client
  .post("https://api.openai.com/v1/completions", params)
  .then((result) => {
    console.log(result.data.choices[0].text);
  })
  .catch((err) => {
    console.log(err);
  });
