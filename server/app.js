const express = require('express');
const app = express()
const db = require('./scripts/db');
const cors = require('cors');


// best check to know where the error is
const sendError = (res, req, message, statusCode = 500) => {
    res.status(statusCode).json({
    status: 'error',
    endpoint: req.originalUrl,
    method: req.method,
    message: message
    })
}

app.use(cors());
app.use(express.json());

/***************************
 ******** CUSTOMERS *********
 ***************************/


// GET CUSTOMERS
app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, datas) => {
        if(err){
        console.log("Error making the query", err)
        sendError(res, req, 'Error on the server');
        return;
    
    }
    res.json(datas)
    })
})


// GET CUSTOMER BY ID
app.get('/customers/:id_custumer', (req, res) => {
    const {id_custumer} = req.params;
    db.query('SELECT * FROM customers WHERE id_custumer = ?', [id_custumer], (err, data) => {
        if(err) {
            return sendError(res, req, 'Error searching for customer');
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({
        mensaje: 'Customer found',
         data
        });
    });
});


// CREATE CUSTOMER
app.post('/customers', (req, res) => {
    const {id_custumer,full_name,identification,address,phone,email} = req.body;
    db.query('INSERT INTO customers (id_custumer,full_name,identification,address,phone,email) VALUES (?,?,?,?,?,?)', [id_custumer,full_name,identification,address,phone,email], (err, data) => {
       if (err) {
        return sendError(res, req, 'Error creating a customer');
       } 
       res.json({
        mensaje: 'Created customer',
        data
       })
    })
})

// UPDATE CUSTOMER
app.put('/customers/:id_custumer', (req, res) => {
    const {full_name,identification,address,phone,email} = req.body;
    const {id_custumer} = req.params;
    db.query('UPDATE customers SET full_name = ?, identification = ?, address = ?,phone = ? , email = ? WHERE id_custumer = ?', [full_name,identification,address,phone,email, id_custumer], (err, data) => {
        if (err) {
      return sendError(res, req, 'Error updating the customer');
    }
    res.json({
      mensaje: 'Updated customer',
      data
    });
    })
})

// DELETE CUSTOMER
app.delete('/customers/:id_custumer', (req, res) => {
    const {id_custumer} = req.params;
    db.query('DELETE FROM customers WHERE id_custumer = ?', [id_custumer], (err, data) => {
        if (err) {
      return sendError(res, req, 'Error deleting customer');
    }

    if (data.length === 0) {
      return sendError(res, req, 'Customer not found', 404);
    }

    res.json({
      mensaje: 'Deleted customer',
      data
    });
    })
})



/***************************
 ******** INVOCES  *********
 ***************************/


 // GET CUSTOMERS
app.get('/invoces', (req, res) => {
    db.query(`SELECT 
      i.id_invoice, 
      i.billing_period,
      i.billed_amount,
      i.amount_paid,
      i.id_custumer, 
      c.full_name as nombre_cliente
      FROM invoices i 
      LEFT JOIN customers c ON i.id_custumer = c.id_custumer;`, (err, datas) => {
     
        if(err){
        console.log("Error making the query", err)
        sendError(res, req, 'Error on the server');
        return;
    
    }
    res.json(datas)
    })
})


// GET CUSTOMER BY ID
app.get('/invoces/:id_invoice', (req, res) => {
    const {id_invoice} = req.params;
    db.query('SELECT * FROM invoces WHERE id_invoice = ?', [id_invoice], (err, data) => {
        if(err) {
            return sendError(res, req, 'Error searching for customer');
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({
        mensaje: 'Customer found',
         data
        });
    });
});


/***************************
 *****ADVANCED QUERIES******
 ***************************/


// Total paid by each customer

app.get('/paid/customer', (req, res) => {
  db.query(`SELECT 
      c.id_custumer,
      c.full_name,
      SUM(t.amount) AS total_paid
    FROM transactions t
    JOIN customers c ON t.id_custumer = c.id_custumer
    WHERE t.status_transac = ?
    GROUP BY c.id_custumer, c.full_name
    ORDER BY total_paid DESC;`, ['Completada'], (err, data) => {
    if (err) {
      return sendError(res, req, 'Error searching for data');
    }
    res.json({
      mensaje: 'Here are the data',
      data
    });
  });
});


// Pending invoices with customer and associated transaction information

app.get('/invoices/pending', (req, res) => {
  db.query(`SELECT 
    i.id_invoice,
    i.invoice_number,
    i.billing_period,
    i.billed_amount,
    i.amount_paid,
    c.full_name AS customer_name,
    c.identification,
    c.phone,
    c.email,
    t.id_transaction,
    t.transaction_datetime,
    t.amount AS transaction_amount,
    t.status_transac,
    t.platform
FROM invoices i
JOIN customers c 
    ON i.id_custumer = c.id_custumer
LEFT JOIN transactions t 
    ON i.id_invoice = t.id_invoice
WHERE i.billed_amount > i.amount_paid
ORDER BY c.full_name, i.billing_period DESC;`, (err, data) => {
    if (err) {
      return sendError(res, req, 'Error searching for data');
    }
    res.json({
      mensaje: 'Here are the data',
      data
    });
  });
});



// List of transactions by platform = Nequi
app.get('/transaccion/nequi', (req, res) => {
  db.query(`SELECT 
    t.id_transaction,
    t.transaction_datetime,
    t.amount,
    t.status_transac,
    t.platform,
    c.full_name AS cliente
  FROM transactions t
  JOIN customers c ON t.id_custumer = c.id_custumer
  JOIN invoices i ON t.id_invoice = i.id_invoice
  WHERE t.platform = 'Nequi';
`, (err, data) => {
    if (err) {
      return sendError(res, req, 'Error searching for data');
    }
    res.json({
      mensaje: 'Here are the data',
      data
    });
  });
});

// List of transactions by platform = Daviplata

app.get('/transaccion/daviplata', (req, res) => {
  db.query(`SELECT 
    t.id_transaction,
    t.transaction_datetime,
    t.amount,
    t.status_transac,
    t.platform,
    c.full_name AS cliente
FROM transactions t
JOIN customers c ON t.id_custumer = c.id_custumer
JOIN invoices i ON t.id_invoice = i.id_invoice
WHERE t.platform = 'Daviplata';
`, ['Completada'], (err, data) => {
    if (err) {
      return sendError(res, req, 'Error searching for data');
    }
    res.json({
      mensaje: 'Here are the data',
      data
    });
  });
});

// List of transactions by platform
app.get('/transaccion/nequi-daviplata', (req, res) => {
  db.query(`SELECT 
    t.id_transaction,
    t.transaction_datetime,
    t.amount,
    t.status_transac,
    t.platform,
    c.full_name AS cliente
FROM transactions t
JOIN customers c ON t.id_custumer = c.id_custumer
JOIN invoices i ON t.id_invoice = i.id_invoice
WHERE t.platform IN ('Nequi', 'Daviplata') 
ORDER BY t.transaction_datetime DESC;
`, (err, data) => {
    if (err) {
      return sendError(res, req, 'Error searching for data');
    }
    res.json({
      mensaje: 'Here are the data',
      data
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});