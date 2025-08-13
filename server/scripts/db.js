const mysql = require('mysql2');

// database data
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Qwe.123*",
  database: "payments",
});


connection.connect((err) => {
    if(err) {
        console.log("connection error", err);
        return;
    }
    console.log("Successful connection to mysql")
})

// we export the connection
module.exports = connection