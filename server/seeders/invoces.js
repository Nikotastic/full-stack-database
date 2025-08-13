// this file reads the csv file and inserts the data into the database

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const conexion = require('../scripts/db'); // converts the contents of the .csv file into JavaScript objects

const archivoCSV = path.join(__dirname, '../data/invoces.csv');
fs.createReadStream(archivoCSV)
.pipe(csv()) 
.on('data', (row) => {
    const {id_invoice,invoice_number,billing_period,billed_amount,amount_paid,id_custumer} = row; // contiene un objeto
    const sql = 'INSERT INTO invoices (id_invoice,invoice_number,billing_period,billed_amount,amount_paid,id_custumer) VALUES (?,?,?,?,?,?)';
    conexion.query(sql, [id_invoice,invoice_number,billing_period,billed_amount,amount_paid,id_custumer], (err) => {
        if (err) console.log("Error inserting data", err);
        else 
        console.log(`inserted: ${id_custumer}`)
    })
})

.on('end', () => {
    console.log("import completed")
})