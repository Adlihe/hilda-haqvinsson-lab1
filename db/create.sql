DROP DATABASE travel_wishlist_db;
CREATE DATABASE travel_wishlist_db;
USE travel_wishlist_db;

create table users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user'
);

create table places (
    placeId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    userId INT NOT NULL,

    CONSTRAINT FK_user_places FOREIGN KEY (userId) REFERENCES users(userId)
);

INSERT INTO users (username, password, role)
VALUES
    ('admin',   'admin123',   'admin'),
    ('emma',    'emma123',    'user'),
    ('liam',    'liam123',    'user'),
    ('olivia',  'olivia123',  'user');


INSERT INTO places (title, description, status, userId)
VALUES
    ('Paris, France',
     'Visit the Eiffel Tower and explore local cafés',
     'wishlist',
     2),

    ('Kyoto, Japan',
     'Experience traditional temples and cherry blossoms in the spring',
     'planned',
     2),

    ('New York City, USA',
     'See a Broadway show and explore Manhattan',
     'visited',
     3),

    ('Rome, Italy',
     'Explore ancient ruins and eat authentic Italian food',
     'wishlist',
     3),

    ('Reykjavík, Iceland',
     'See the northern lights and visit hot springs',
     'planned',
     4),

    ('Sydney, Australia',
     'Visit the Opera House and Bondi Beach',
     'wishlist',
     1),

    ('Barcelona, Spain',
     'Enjoy architecture and Mediterranean beaches',
     'visited',
     2),

    ('Cape Town, South Africa',
     'Hike Table Mountain and visit the coastline',
     'planned',
     3),

    ('Bangkok, Thailand',
     'Explore street food and temples',
     'cancelled',
     4),

    ('London, United Kingdom',
     'Visit museums and historic landmarks',
     'visited',
     1);



show tables;


SELECT 
    p.placeId AS placeId,
    p.title AS place,
    p.description,
    p.status,
    u.userId AS userId,
    u.username AS name,
    u.role AS role
FROM places p
    JOIN users u ON p.userId = u.userId
;
