const express = require('express');
const app = express();

app.use(express.json());

const BOT_TOKEN = "8006727591:AAEV_dUqPOWcxYwDdYY2rH79dOe417J27wo";

app.post('/webhook', async (req, res) => {
    try {
        const update = req.body;

        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const callbackData = callbackQuery.data;
            const message = callbackQuery.message;
            const chatId = message.chat.id;
            const messageId = message.message_id;
            let originalText = message.text;

            let newStatusText = "";

            if (callbackData.startsWith("complete_")) {
                newStatusText = "🟢 Current Status: Completed";
            } else if (callbackData.startsWith("cancel_")) {
                newStatusText = "🔴 Current Status: Cancelled";
            }

            if (newStatusText) {
                let updatedText = originalText.replace("🟡 Current Status: Pending", newStatusText);

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: messageId,
                        text: updatedText
                    })
                });

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        callback_query_id: callbackQuery.id,
                        text: "Status ပြောင်းလဲပြီးပါပြီ!"
                    })
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                  
