# Database System for ExpertSoft

## Description

This is a full-stack project consisting of a Node.js and Express backend that manages a library database, and a frontend built with Vite and pure JavaScript to interact with the backend API.

The mission is to propose and implement a solution that organizes and structures this information in a SQL database, facilitating its loading, storage, and subsequent management through a CRUD system, along with key queries that meet the client's needs.

## Project Structure

```
/
|-- client/           # Frontend Application
|   |-- src/
|   |   |-- main.js     
|   |-- index.html     
|-- docs/           # Aplicación Backend
|   |-- database payments_db.sql        
|   |-- entity relationship diagram.png         
|   |-- payments.postman      
|   |           
|   |       
|-- server/             
|   |-- data/
|   |     |-- customers.csv
|   |     |-- invoces.csv
|   |     |-- transactions.csv
|   |-- scripts/
|   |     |-- db.js
|   |-- seeders/ 
|   |     |-- customer.js
|   |     |-- invoses.js
|   |     |-- transactions.js
|   |-- app.js   
|-- README.md         
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Base de Datos:** MySQL
- **Frontend:** HTML, CSS, JavaScript
- **Librerías:** `mysql2`, `fast-csv`

## Database Normalization

The database is normalized to reduce redundancy and improve data integrity. The normalization process includes:

- **First Normal Form (1NF):** Each table has a primary key, and all columns contain atomic values.
- **Second Normal Form (2NF):** All non-key attributes are completely dependent on the primary key. This is achieved by creating separate tables for customers, invocations, and transactions.
- **Third Normal Form (3NF):** All attributes depend solely on the primary key and not on other non-key attributes. This is ensured by separating transitive dependencies.

## Project Execution

### Clone the repository:

 ```bash
    git clone <https://github.com/Nikotastic/prueba-de-conexion.git>
    cd <https://github.com/Nikotastic/prueba-de-conexion.git>
```

### Prerequisites

- Node.js and npm installed
- MySQL server running

### Backend Configuration

1. **Navigate to the `server` directory:**
```bash
cd server
```

2. **Install the dependencies:**
```bash
npm install
```
3. **Set up the database:**
- Create a MySQL database.
- Update the database connection details in `scripts/db.js`.

4. **Run the database schema:**
- Run the `docs/database payments_db` file to create the tables.

5. **Populate the database from the CSV files:**
    ```bash
    node seeders/customers.js
    node seeders/inverces.js
    node seeders/transactions.js
    ```

6. **Start the server:**
    ```bash
    node app.js
    ```

### Frontend Configuration

1. **Navigate to the `client` directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```
## Bulk Data Loading from CSV

The `seeders` directory contains scripts for loading data from CSV files into the database. Each script corresponds to a table and uses the `fast-csv` library to parse CSV files located in the `data` directory.

To perform a bulk data load, run the seeder scripts as described in the "Backend Configuration" section.


## Advanced Queries

The system includes a variety of advanced SQL queries for retrieving and manipulating data. These queries are designed to demonstrate different aspects of SQL, including:

-   **Total paid by each customer:**
    ```sql
    SELECT 
      c.id_custumer,
      c.full_name,
      SUM(t.amount) AS total_paid
    FROM transactions t
    JOIN customers c ON t.id_custumer = c.id_custumer
    WHERE t.status_transac = ?
    GROUP BY c.id_custumer, c.full_name
    ORDER BY total_paid DESC;
    ```

-   **Outstanding invoices with customer and associated transaction information:**
    ```sql
    SELECT 
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
    ORDER BY c.full_name, i.billing_period DESC;;
    ```

-   **List of transactions by platform:**
    ```sql
    SELECT 
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
    ```

## Relational Model

![Modelo Relacional](docs/entity%20relationship%20diagram.drawio.png) 

## Desarrollador

-   **Nombre:** Nikol velasquez
-   **Clan:** Sierra
-   **Correo:** velasqueznikol10@gmail.com