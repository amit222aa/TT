#ifndef SERVER_H
#define SERVER_H

#include <string>
#include <map>
#include "database.h"

class Server {
public:
    Server(int port, Database* db);
    ~Server();
    
    bool start();
    void stop();
    
    // HTTP request handler
    std::string handle_request(const std::string& method, const std::string& endpoint, const std::string& body);
    
private:
    int port;
    Database* database;
    bool running;
    
    // API endpoints
    std::string handle_auth(const std::string& method, const std::string& body);
    std::string handle_menu(const std::string& method, const std::string& body);
    std::string handle_cart(const std::string& method, const std::string& body);
    std::string handle_orders(const std::string& method, const std::string& body);
    
    // JSON helpers
    std::string json_encode(const std::map<std::string, std::string>& data);
    std::map<std::string, std::string> json_decode(const std::string& json);
};

#endif // SERVER_H
