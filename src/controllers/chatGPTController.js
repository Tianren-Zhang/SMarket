const OpenAI = require('openai');
const { validationResult } = require('express-validator');

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// exports.getChatResponse = async (req, res, next) => {
//     const userMessage = req.body.message;
//     try {
//         const openaiResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo", // Replace with your chosen model
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a helpful assistant."
//                 },
//                 {
//                     role: "user",
//                     content: userMessage
//                 }
//             ],
//         });

//         // Send back the completion text as the response
//         res.json({message: openaiResponse.choices[0].message.content});
//     } catch (err) {
//         console.error('Error calling OpenAI:', err);
//         next(err);
//     }
// };
