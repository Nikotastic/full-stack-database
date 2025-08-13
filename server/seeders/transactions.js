// this file reads the csv file and inserts the data into the database

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const conexion = require('../scripts/db'); // converts the contents of the .csv file into JavaScript objects

const archivoCSV = path.join(__dirname, '../data/transactions.csv');
fs.createReadStream(archivoCSV)
.pipe(csv()) 
.on('data', (row) => {
    const {id_transaction,transaction_datetime,amount,status_transac,transaction_type,platform,id_invoice,id_custumer} = row; // contiene un objeto
    const sql = 'INSERT INTO transactions (id_transaction,transaction_datetime,amount,status_transac,transaction_type,platform,id_invoice,id_custumer) VALUES (?,?,?,?,?,?,?,?)';
    conexion.query(sql, [id_transaction,transaction_datetime,amount,status_transac,transaction_type,platform,id_invoice,id_custumer], (err) => {
        if (err) console.log("Error inserting data", err);
        else 
        console.log(`data inserted`)
    })
})

.on('end', () => {
    console.log("import completed")
})