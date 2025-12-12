DROP DATABASE fruitnflower_db;
CREATE DATABASE fruitnflower_db;
USE fruitnflower_db;

show tables; 

create table Category (
    categoryId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

create table Supplier (
    supplierId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30), 
    email VARCHAR(100)
);

create table Product (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    categoryID INT NOT NULL,
    supplierID INT NOT NULL,

    CONSTRAINT FK_categoryId FOREIGN KEY (categoryId) REFERENCES Category(categoryId),
    CONSTRAINT FK_supplierId FOREIGN KEY (supplierId) REFERENCES Supplier(supplierId)
);

INSERT INTO Supplier (name, phone, email)
    values
    ('Småland Flora', '0380112233', 'smalland_flora@mail.com'),
    ('Northern Forest Berries', '090120617', 'north.frst.berries@mail.com'),
    ('Österlen Fruit Farms', '044556677', 'osterlen_ff@mail.com');

INSERT INTO Category (name)
    values
    ('Fruit'), ('Flower');

INSERT INTO Product (name, quantity, price, categoryid, supplierid)
VALUES
    ('Apple (Aroma)', 45, 32.90, 1, 3),   
    ('Blueberries', 32, 39.00, 1, 2),     
    ('Strawberries', 15, 45.50, 1, 2),    
    ('Pear (Conference)', 23, 38.00, 1, 3),

    ('Lily', 562, 45.60, 2, 1),          
    ('Sunflower', 99, 25.00, 2, 1),     
    ('Red Rose', 348, 35.00, 2, 1),      
    ('Tulip', 63, 89.00, 2, 1);     

    

show tables;

Select * from Product order by quantity desc; 


SELECT 
    p.productId AS productId,
    p.name AS product_name,
    p.quantity,
    p.price,
    s.supplierId AS supplierId,
    s.name AS supplier_name,
    c.name AS category
FROM Product p
    JOIN Supplier s ON p.supplierId = s.supplierId
    JOIN Category c ON p.categoryId = c.categoryId
;
