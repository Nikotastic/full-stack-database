CREATE DATABASE IF NOT EXISTS pd_nikol_velasquez_sierra;
USE pd_nikol_velasquez_sierra;
-- DATABASE payments
-- ==========================
-- 1. CUSTOMERS
-- ==========================
CREATE TABLE customers (
    id_custumer INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    identification VARCHAR(20) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp
    
);

-- ==========================
-- 2. INVOICES
-- ==========================
CREATE TABLE invoices (
    id_invoice INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    billing_period VARCHAR(7) NOT NULL, -- formato YYYY-MM
    billed_amount DECIMAL(12,2) NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL,
    id_custumer INT,
    created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
    FOREIGN KEY (id_custumer) REFERENCES customers(id_custumer)
	ON UPDATE CASCADE 
    ON DELETE SET NULL
  
);

-- ==========================
-- 3. TRANSACTIONS
-- ==========================
CREATE TABLE transactions (
    id_transaction VARCHAR(20) PRIMARY KEY, 
    transaction_datetime DATETIME NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status_transac ENUM('Pendiente','Fallida','Completada') NOT NULL,
    transaction_type ENUM('Pago de Factura') NOT NULL,
	platform ENUM('Nequi', 'Daviplata') NOT NULL,
	id_invoice INT,
    id_custumer INT,
    created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
    FOREIGN KEY (id_invoice) REFERENCES invoices(id_invoice)
         ON UPDATE CASCADE 
         ON DELETE SET NULL,
    FOREIGN KEY (id_custumer) REFERENCES customers(id_custumer)
         ON UPDATE CASCADE 
         ON DELETE SET NULL
);

     
select * from customers;
select * from invoices;
select * from transactions;