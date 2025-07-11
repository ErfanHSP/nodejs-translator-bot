const TelegramBot = require('node-telegram-bot-api');
const token = '7772070528:AAHBQRW_HozsNTydchLn75hXcJ47onWaUlg';
const componentsList = require("./components/components_list")
const db = require("./utils/db")
const oneApiToken = "295532:67681e3a6595f"
const axios = require("axios")

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, "Welcome to translator bot, choose the translator engine.", componentsList.inlineKeyboard)
});

bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id
    const command = query.data
    
    const translateEngines = [
        "google",
        "microsoft",
        "yandex"
    ]
    const myLangs = [
        "fa",
        "en",
        "ar",
        "it",
        "de",
        "fr",
        "az"
    ]
    if (translateEngines.includes(command)) {
        const isUserRecordExists = await db.query("SELECT chatId FROM usersactions WHERE chatId = ?", [chatId])
        console.log("isUserRecordExists: ", isUserRecordExists[0])
        if (isUserRecordExists[0] == false) { // first part of this property is our query result and the second part is description and field name and so on.
            db.query("insert into usersActions(chatId, engine) values(?, ?)", [chatId, command])
        } else {
            db.query('UPDATE usersActions SET engine = ? WHERE chatId = ?', [command, chatId], (err, results) => {
                if (err) {
                    console.error('Error updating record:', err.message);
                } else {
                    console.log('Record updated successfully:', results);
                }
            });
        }
        const keyboard = componentsList.destinationLanguage
            bot.editMessageText("Choose the destination language you want to translate to.", {
                chat_id: chatId,
                message_id: query.message.message_id,
                reply_markup: keyboard.reply_markup
            })
    }
        
    if (myLangs.includes(command)) {
        bot.sendMessage(chatId, "Send the text that you want to translate.")
        db.query('UPDATE usersActions SET lang = ? WHERE chatId = ?', [command, chatId], (err, results) => {
            if (err) {
                console.error('Error updating record:', err.message);
            } else {
                console.log('Record updated successfully:', results);
            }
        });
    }
})

bot.on("message", async (msg) => {
    const chatId = msg.chat.id
    const message = msg.text
    const translateEngineArray = await db.query("SELECT engine FROM usersactions WHERE chatId = ?", [chatId])
    const langArray = await db.query("SELECT lang FROM usersactions WHERE chatId = ?", [chatId])
    if (!message.startsWith("/")) {
        const lang = langArray[0][0].lang
        const translateEngine = translateEngineArray[0][0].engine
        if (translateEngine && lang) {
            console.log("fins: ", lang, translateEngine)
            const headers = {
                'accept': 'application/json',
                'one-api-token': oneApiToken,
                'Content-Type': 'application/json',
            }
            const response = await axios.post(`https://api.one-api.ir/translate/v1/${translateEngine}/`, {
                source: 'auto',
                target: lang,
                text: message,
            }, {headers})
            console.log(response)
            bot.sendMessage(chatId, response.data.result)
        }
    }
})

bot.on("polling_error", (err) => {
    console.log("polling error: ", err)
})
// How to insert to db.

// bot.onText(/\/save_message (.+)/, async (msg, match) => {
//   const text = match[1]
//   const chatId = msg.chat.id
//   const addMessage = await db.query("INSERT INTO messages(chatid, text) VALUES (?, ?)", [chatId, text])
//   if (addMessage) {
//     bot.sendMessage(chatId, "Your message have successfully added to db.")
//   }
// })
