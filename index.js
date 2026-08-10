const express = require('express');
const app = express();

app.use(express.json());

const BOT_TOKEN = "8006727591:AAEV_dUqPOWcxYwDdYY2rH79dOe417J27wo";

// Root Path ရော /webhook ပါ နှစ်ခုလုံးအတွက် ဖမ်းပေးမည်
app.all(['/', '/webhook', '/index.js'], async (req, res) => {
    try {
        const update = req.body;

        if (update && update.callback_query) {
            const callbackQuery = update.callback_query;
            const callbackData = callbackQuery.data || "";
            const message = callbackQuery.message;
            const chatId = message.chat.id;
            const messageId = message.message_id;
            let originalText = message.text || "";

            let updatedText = "";

            // ခလုတ်နှိပ်လိုက်တဲ့ Data ပေါ်မူတည်ပြီး စစ်မည်
            if (callbackData.includes("complete") || callbackData === "status_complete") {
                updatedText = originalText.replace(/🟡 Current Status: Pending|🟡 Status: Pending|Pending/g, "🟢 Current Status: Completed");
            } else if (callbackData.includes("cancel") || callbackData === "status_cancel") {
                updatedText = originalText.replace(/🟡 Current Status: Pending|🟡 Status: Pending|Pending/g, "🔴 Current Status: Cancelled");
            }

            if (updatedText && updatedText !== originalText) {
                // Telegram Message စာသားကို ပြောင်းလဲပေးမည်
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: messageId,
                        text: updatedText
                    })
                });
            }

            // Telegram Button Loading ပျောက်အောင် အကြောင်းပြန်မည်
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    callback_query_id: callbackQuery.id,
                    text: "Status ပြောင်းလဲပြီးပါပြီ!"
                })
            });
        }
    } catch (err) {
        console.error("Error:", err);
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
