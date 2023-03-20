
// require('dotenv').config()
// const { Configuration, OpenAIApi } = require("openai");
// const util = require('util');
// const sleep = util.promisify(setTimeout);

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);


// const getResponse = async (prompt) => {
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: prompt,
//         max_tokens: 400,
//         temperature: 0.9,
//     });
//     // pause()
//     sleepNow(5000)
//     let pranbhansu = response.data.choices[0].text
//     // console.log("response form chat", pranbhansu);
//     return pranbhansu
// }

// // async function pause() {
// //     console.log('Pausing for 5 seconds...');
// //     await sleep(5000);
// //     console.log('Done!');
// // }


// const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// module.exports = getResponse;