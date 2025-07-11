const inlineKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: "گوگل ترجمه", callback_data: "google"},
            ],
            [
                {text: "ترجمه با یاندکس", callback_data: "yandex"},
            ],
            [
                {text: "مترجم مایکروسافت", callback_data: "microsoft"},
            ]
        ]
    }
}

const destinationLanguage = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: "فارسی", callback_data: "fa"},
                {text: "انگلیسی", callback_data: "en"}
            ],
            [
                {text: "عربی", callback_data: "ar"},
                {text: "آلمانی", callback_data: "de"}
            ],
            [
                {text: "فرانسوی", callback_data: "fr"},
                {text: "ایتالیایی", callback_data: "it"}
            ],
            [
                {text: "ترکی", callback_data: "az"}
            ]
        ]
    }
}

module.exports = {
    inlineKeyboard,
    destinationLanguage
}