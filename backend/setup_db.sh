#!/bin/bash
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS fanaven; CREATE USER IF NOT EXISTS 'fanaven_user'@'localhost' IDENTIFIED BY 'password'; GRANT ALL PRIVILEGES ON fanaven.* TO 'fanaven_user'@'localhost'; FLUSH PRIVILEGES;"
echo "Database and user created successfully."
