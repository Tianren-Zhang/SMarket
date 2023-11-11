const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.getChatResponse = async (req, res) => {
    const userMessage = req.body.message;

    try {
        const openaiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Replace with your chosen model
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
        });

        // Send back the completion text as the response
        res.json({ message: openaiResponse.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        res.status(500).json({ error: 'Error processing your message.' });
    }
};
