#include "database.h"
#include <iostream>
#include <sstream>
#include <cstring>
#include <algorithm>

// Simple hash function (use bcrypt in production!)
std::string Database::hash_password(const std::string& password) {
    // This is a placeholder - use proper hashing in production
    return password; // DO NOT USE IN PRODUCTION
}

Database::Database(const std::string& db_path) : db(nullptr), db_path(db_path) {}

Database::~Database() {
    if (db) {
        sqlite3_close(db);
    }
}

bool Database::initialize() {
    int rc = sqlite3_open(db_path.c_str(), &db);
    
    if (rc != SQLITE_OK) {
        std::cerr << "Cannot open database: " << sqlite3_errmsg(db) << std::endl;
        return false;
    }
    
    // Create tables
    std::string create_users_query = R"(
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
    )";
    
    std::string create_menu_query = R"(
        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT
        );
    )";
    
    std::string create_cart_query = R"(
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            menu_item_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
        );
    )";
    
    std::string create_orders_query = R"(
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            total_amount REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    )";
    
    std::string create_order_items_query = R"(
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            menu_item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
        );
    )";
    
    execute_query(create_users_query);
    execute_query(create_menu_query);
    execute_query(create_cart_query);
    execute_query(create_orders_query);
    execute_query(create_order_items_query);
    
    return true;
}

bool Database::execute_query(const std::string& query) {
    char* err_msg = nullptr;
    int rc = sqlite3_exec(db, query.c_str(), nullptr, nullptr, &err_msg);
    
    if (rc != SQLITE_OK) {
        std::cerr << "SQL error: " << err_msg << std::endl;
        sqlite3_free(err_msg);
        return false;
    }
    
    return true;
}

bool Database::register_user(const std::string& username, const std::string& email, const std::string& password) {
    std::string password_hash = hash_password(password);
    
    std::ostringstream query;
    query << "INSERT INTO users (username, email, password_hash) VALUES ('"
          << username << "', '" << email << "', '" << password_hash << "');";
    
    return execute_query(query.str());
}

User* Database::authenticate_user(const std::string& username, const std::string& password) {
    std::string password_hash = hash_password(password);
    
    std::ostringstream query;
    query << "SELECT id, username, email FROM users WHERE username='" << username 
          << "' AND password_hash='" << password_hash << "';";
    
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db, query.str().c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            User* user = new User();
            user->id = sqlite3_column_int(stmt, 0);
            user->username = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)));
            user->email = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)));
            sqlite3_finalize(stmt);
            return user;
        }
    }
    sqlite3_finalize(stmt);
    return nullptr;
}

std::vector<MenuItem> Database::get_all_menu_items() {
    std::vector<MenuItem> items;
    sqlite3_stmt* stmt;
    
    const char* query = "SELECT id, name, category, price, description FROM menu_items;";
    
    if (sqlite3_prepare_v2(db, query, -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            MenuItem item;
            item.id = sqlite3_column_int(stmt, 0);
            item.name = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)));
            item.category = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)));
            item.price = sqlite3_column_double(stmt, 3);
            item.description = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4)));
            items.push_back(item);
        }
    }
    sqlite3_finalize(stmt);
    
    return items;
}

std::vector<MenuItem> Database::get_menu_by_category(const std::string& category) {
    std::vector<MenuItem> items;
    sqlite3_stmt* stmt;
    
    std::ostringstream query;
    query << "SELECT id, name, category, price, description FROM menu_items WHERE category='" << category << "';";
    
    if (sqlite3_prepare_v2(db, query.str().c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            MenuItem item;
            item.id = sqlite3_column_int(stmt, 0);
            item.name = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)));
            item.category = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)));
            item.price = sqlite3_column_double(stmt, 3);
            item.description = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4)));
            items.push_back(item);
        }
    }
    sqlite3_finalize(stmt);
    
    return items;
}

bool Database::add_menu_item(const std::string& name, const std::string& category, double price, const std::string& description) {
    std::ostringstream query;
    query << "INSERT INTO menu_items (name, category, price, description) VALUES ('"
          << name << "', '" << category << "', " << price << ", '" << description << "');";
    
    return execute_query(query.str());
}

bool Database::add_to_cart(int user_id, int menu_item_id, int quantity) {
    std::ostringstream query;
    query << "INSERT INTO cart (user_id, menu_item_id, quantity) VALUES ("
          << user_id << ", " << menu_item_id << ", " << quantity << ");";
    
    return execute_query(query.str());
}

std::vector<CartItem> Database::get_cart(int user_id) {
    std::vector<CartItem> items;
    sqlite3_stmt* stmt;
    
    std::ostringstream query;
    query << "SELECT c.id, c.menu_item_id, c.user_id, c.quantity, m.name, m.price "
          << "FROM cart c JOIN menu_items m ON c.menu_item_id = m.id WHERE c.user_id = " << user_id << ";";
    
    if (sqlite3_prepare_v2(db, query.str().c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            CartItem item;
            item.id = sqlite3_column_int(stmt, 0);
            item.menu_item_id = sqlite3_column_int(stmt, 1);
            item.user_id = sqlite3_column_int(stmt, 2);
            item.quantity = sqlite3_column_int(stmt, 3);
            item.item_name = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4)));
            item.price = sqlite3_column_double(stmt, 5);
            items.push_back(item);
        }
    }
    sqlite3_finalize(stmt);
    
    return items;
}

bool Database::clear_cart(int user_id) {
    std::ostringstream query;
    query << "DELETE FROM cart WHERE user_id = " << user_id << ";";
    
    return execute_query(query.str());
}

bool Database::remove_from_cart(int user_id, int menu_item_id) {
    std::ostringstream query;
    query << "DELETE FROM cart WHERE user_id = " << user_id << " AND menu_item_id = " << menu_item_id << ";";
    
    return execute_query(query.str());
}

int Database::create_order(int user_id, const std::vector<CartItem>& items) {
    double total = 0;
    for (const auto& item : items) {
        total += item.price * item.quantity;
    }
    
    std::ostringstream query;
    query << "INSERT INTO orders (user_id, total_amount) VALUES (" << user_id << ", " << total << ");";
    
    if (!execute_query(query.str())) {
        return -1;
    }
    
    int order_id = sqlite3_last_insert_rowid(db);
    
    for (const auto& item : items) {
        std::ostringstream item_query;
        item_query << "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ("
                   << order_id << ", " << item.menu_item_id << ", " << item.quantity << ", " << item.price << ");";
        execute_query(item_query.str());
    }
    
    return order_id;
}

std::vector<Order> Database::get_user_orders(int user_id) {
    std::vector<Order> orders;
    sqlite3_stmt* stmt;
    
    std::ostringstream query;
    query << "SELECT id, status, total_amount, created_at FROM orders WHERE user_id = " << user_id << " ORDER BY created_at DESC;";
    
    if (sqlite3_prepare_v2(db, query.str().c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            Order order;
            order.id = sqlite3_column_int(stmt, 0);
            order.user_id = user_id;
            order.status = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)));
            order.total_amount = sqlite3_column_double(stmt, 2);
            order.created_at = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3)));
            orders.push_back(order);
        }
    }
    sqlite3_finalize(stmt);
    
    return orders;
}

Order Database::get_order_by_id(int order_id) {
    Order order;
    sqlite3_stmt* stmt;
    
    std::ostringstream query;
    query << "SELECT id, user_id, status, total_amount, created_at FROM orders WHERE id = " << order_id << ";";
    
    if (sqlite3_prepare_v2(db, query.str().c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            order.id = sqlite3_column_int(stmt, 0);
            order.user_id = sqlite3_column_int(stmt, 1);
            order.status = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)));
            order.total_amount = sqlite3_column_double(stmt, 3);
            order.created_at = std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4)));
        }
    }
    sqlite3_finalize(stmt);
    
    return order;
}

bool Database::update_order_status(int order_id, const std::string& status) {
    std::ostringstream query;
    query << "UPDATE orders SET status = '" << status << "' WHERE id = " << order_id << ";";
    
    return execute_query(query.str());
}
