// this file reads the csv file and inserts the data into the database

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const conexion = require('../scripts/db'); // converts the contents of the .csv file into JavaScript objects

const archivoCSV = path.join(__dirname, '../data/customers.csv');
fs.createReadStream(archivoCSV)
.pipe(csv()) 
.on('data', (row) => {
    const {id_custumer,full_name,identification,address,phone,email} = row; 
    const sql = 'INSERT INTO customers (id_custumer,full_name,identification,address,phone,email) VALUES (?,?,?,?,?,?)';
    conexion.query(sql, [id_custumer,full_name,identification,address,phone,email], (err) => {
        if (err) console.log("Error inserting data", err);
        else 
        console.log(`inserted: ${full_name}`)
    })
})

.on('end', () => {
    console.log("import completed")
})