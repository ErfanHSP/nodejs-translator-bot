const mysql = require("mysql2")

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "translator-bot"
}).promise()

pool.getConnection()
    .then(() => {
        console.log("Connection was successful")
    })
    .catch((err) => {
        console.log("Error connecting db: ", err)
    })

module.exports = pool