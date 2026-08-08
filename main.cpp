#include <iostream>
#include <cstring>
#include "database.h"
#include "server.h"

int main(int argc, char* argv[]) {
    std::cout << "========================================" << std::endl;
    std::cout << "  Online Food Ordering System - Backend" << std::endl;
    std::cout << "========================================" << std::endl;
    
    // Initialize database
    Database db("food_ordering.db");
    
    if (!db.initialize()) {
        std::cerr << "Failed to initialize database" << std::endl;
        return 1;
    }
    
    std::cout << "✓ Database initialized successfully" << std::endl;
    
    // Add sample menu items
    db.add_menu_item("Margherita Pizza", "Pizza", 12.99, "Fresh mozzarella and tomato sauce");
    db.add_menu_item("Pepperoni Pizza", "Pizza", 13.99, "Loaded with pepperoni");
    db.add_menu_item("Caesar Salad", "Salads", 12.99, "Fresh greens with Caesar dressing");
    db.add_menu_item("Burger Deluxe", "Burgers", 11.99, "Double patty with all toppings");
    db.add_menu_item("Iced Tea", "Beverages", 2.99, "Refreshing iced tea");
    db.add_menu_item("Chocolate Cake", "Desserts", 5.99, "Rich chocolate with ganache topping");
    
    std::cout << "✓ Sample menu items added" << std::endl;
    
    // Initialize server
    Server server(8080, &db);
    
    if (!server.start()) {
        std::cerr << "Failed to start server" << std::endl;
        return 1;
    }
    
    std::cout << "✓ Server started on port 8080" << std::endl;
    std::cout << "\nAPI Endpoints:" << std::endl;
    std::cout << "  GET  /api/menu              - Get all menu items" << std::endl;
    std::cout << "  POST /api/auth/register    - Register new user" << std::endl;
    std::cout << "  POST /api/auth/login       - Login user" << std::endl;
    std::cout << "  GET  /api/cart             - Get user cart" << std::endl;
    std::cout << "  POST /api/cart/add         - Add to cart" << std::endl;
    std::cout << "  GET  /api/orders           - Get user orders" << std::endl;
    std::cout << "  POST /api/orders/create    - Create new order" << std::endl;
    std::cout << "\nFrontend: Open frontend/index.html in your browser" << std::endl;
    std::cout << "Press Ctrl+C to stop the server" << std::endl;
    
    // Keep server running
    std::string input;
    while (std::getline(std::cin, input)) {
        if (input == "quit" || input == "exit") {
            break;
        }
    }
    
    server.stop();
    std::cout << "Server shutdown gracefully" << std::endl;
    
    return 0;
}
