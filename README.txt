DB SET UP:

CREATE TABLE account_types (
    account_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    account_type VARCHAR(12) NOT NULL UNIQUE
);

INSERT INTO account_types (account_type) VALUES ('Individual'), ('Company');

CREATE TABLE users (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    account_id INT UNSIGNED NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account_types(account_id)
);

CREATE TABLE user_titles (
    user_id INT UNSIGNED PRIMARY KEY,
    title VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_phones (
    phone_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    country_code VARCHAR(5),
    phone VARCHAR(20),
    extension VARCHAR(10),
    UNIQUE (user_id, phone),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

To run project be in back-end folder and run : php -S localhost:8000 -t .
