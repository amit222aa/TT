#ifndef DATABASE_H
#define DATABASE_H

#include <string>
#include <vector>
#include <map>
#include <sqlite3.h>

struct User {
    int id;
    std::string username;
    std::string email;
    std::string password_hash;
};

struct MenuItem {
    int id;
    std::string name;
    std::string category;
    double price;
    std::string description;
};

struct CartItem {
    int id;
    int menu_item_id;
    int user_id;
    int quantity;
    std::string item_name;
    double price;
};

struct Order {
    int id;
    int user_id;
    std::string status;
    double total_amount;
    std::string created_at;
    std::vector<CartItem> items;
};

class Database {
public:
    Database(const std::string& db_path);
    ~Database();
    
    bool initialize();
    
    // User operations
    bool register_user(const std::string& username, const std::string& email, const std::string& password);
    User* authenticate_user(const std::string& username, const std::string& password);
    
    // Menu operations
    std::vector<MenuItem> get_all_menu_items();
    std::vector<MenuItem> get_menu_by_category(const std::string& category);
    bool add_menu_item(const std::string& name, const std::string& category, double price, const std::string& description);
    
    // Cart operations
    bool add_to_cart(int user_id, int menu_item_id, int quantity);
    std::vector<CartItem> get_cart(int user_id);
    bool clear_cart(int user_id);
    bool remove_from_cart(int user_id, int menu_item_id);
    
    // Order operations
    int create_order(int user_id, const std::vector<CartItem>& items);
    std::vector<Order> get_user_orders(int user_id);
    Order get_order_by_id(int order_id);
    bool update_order_status(int order_id, const std::string& status);
    
    sqlite3* get_connection() const { return db; }
    
private:
    sqlite3* db;
    std::string db_path;
    
    bool execute_query(const std::string& query);
    std::string hash_password(const std::string& password);
};

#endif // DATABASE_H
